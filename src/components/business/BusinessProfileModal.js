// src/components/business/BusinessProfileModal.js
// ====================================================
// مودال پروفایل کسب‌وکار — نمایش کامل + فلو رزرو
// STEP profile: hero + آمار + امتیاز + نظرات + تیم + نمونه‌کار
// STEP service:  انتخاب خدمت
// STEP datetime: تقویم شمسی + ساعت
// STEP confirm:  تأیید نهایی
// STEP success:  پیام موفقیت
// ====================================================
import React, { useState, useMemo } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, Image, TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

const { width: SW } = Dimensions.get('window');

// ─── الگوریتم تقویم شمسی ─────────────────────────
function gregorianToJalali(gy, gm, gd) {
  let n = 365*(gy-1)+Math.floor((gy-1+3)/4)-Math.floor((gy-1+99)/100)+Math.floor((gy-1+399)/400);
  const gD=[31,28+(gy%4===0&&(gy%100!==0||gy%400===0)?1:0),31,30,31,30,31,31,30,31,30,31];
  for(let i=0;i<gm-1;i++) n+=gD[i]; n+=gd-1;
  let j=n-79,jp=Math.floor(j/12053); j%=12053;
  let jy=979+33*jp+4*Math.floor(j/1461); j%=1461;
  if(j>=366){jy+=Math.floor((j-1)/365);j=(j-1)%365;}
  let jm=0; for(;jm<11&&j>=(jm<6?31:30);jm++) j-=jm<6?31:30;
  return [jy,jm+1,j+1];
}
function jalaliToGregorian(jy,jm,jd){
  jy-=979;jm-=1;jd-=1;
  let j=365*jy+Math.floor(jy/33)*8+Math.floor((jy%33+3)/4);
  for(let i=0;i<jm;i++) j+=i<6?31:30; j+=jd;
  let g=j+79,gy=1600+400*Math.floor(g/146097); g%=146097;
  let lp=true;
  if(g>=36525){g--;gy+=100*Math.floor(g/36524);g%=36524;if(g>=365)g++;else lp=false;}
  gy+=4*Math.floor(g/1461);g%=1461;
  if(g>=366){lp=false;g--;gy+=Math.floor(g/365);g%=365;}
  const m=[31,28+(lp?1:0),31,30,31,30,31,31,30,31,30,31];
  let gm2=0; for(;gm2<12&&g>=m[gm2];gm2++) g-=m[gm2];
  return new Date(gy,gm2,g+1);
}
function daysInJ(jm,jy){if(jm<=6)return 31;if(jm<=11)return 30;return[1,5,9,13,17,22,26,30].includes(jy%33)?30:29;}
function firstWday(jy,jm){return(jalaliToGregorian(jy,jm,1).getDay()+1)%7;}
function todayJ(){const d=new Date();return gregorianToJalali(d.getFullYear(),d.getMonth()+1,d.getDate());}
const JM=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const WD=['ش','ی','د','س','چ','پ','ج'];

// ─── داده کامل کسب‌وکارها ──────────────────────────
// در واقعیت از API میاد
const BIZ = {
  p1:{
    bio:'ارائه خدمات تخصصی ناخن، مژه و ابرو با بیش از ۸ سال تجربه در تهران',
    address:'تهران، پونک، خیابان اشرفی اصفهانی',
    avgScore:4.3, scoreDist:{5:62,4:38,3:18,2:7,1:3}, totalBookings:843,
    team:[
      {id:'t1',name:'سارا احمدی',  role:'متخصص ناخن',avatar:'https://i.pravatar.cc/80?img=5'},
      {id:'t2',name:'نیلوفر رضایی',role:'متخصص مژه', avatar:'https://i.pravatar.cc/80?img=9'},
      {id:'t3',name:'مهسا کریمی', role:'متخصص پوست',avatar:'https://i.pravatar.cc/80?img=16'},
    ],
    portfolio:[
      'https://picsum.photos/seed/pf1/300/300','https://picsum.photos/seed/pf2/300/300',
      'https://picsum.photos/seed/pf3/300/300','https://picsum.photos/seed/pf4/300/300',
      'https://picsum.photos/seed/pf5/300/300','https://picsum.photos/seed/pf6/300/300',
    ],
    reviews:[
      {id:'rv1',userName:'نیلوفر احمدی',avatar:'https://i.pravatar.cc/60?img=5', score:5.0,comment:'کار عالی بود، رضایت کامل دارم!',date:'۱۴۰۳/۱۱/۱۵',serviceName:'کاشت ناخن ژل'},
      {id:'rv2',userName:'مهسا رضایی',  avatar:'https://i.pravatar.cc/60?img=9', score:4.0,comment:'خوب بود ولی کمی دیر شد.',       date:'۱۴۰۳/۱۱/۱۰',serviceName:'کاشت مژه'},
      {id:'rv3',userName:'زهرا محمدی',  avatar:'https://i.pravatar.cc/60?img=16',score:5.0,comment:'طرح دقیقاً همان چیزی بود که می‌خواستم!',date:'۱۴۰۳/۱۱/۰۵',serviceName:'طراحی ناخن'},
    ],
    services:[
      {id:'s1',name:'کاشت ناخن ژل',price:350000,duration:90, image:'https://picsum.photos/seed/s1/200',score:4.6,schedule:{days:[],duration:90, timesByDay:{}}},
      {id:'s2',name:'طراحی ناخن',  price:180000,duration:60, image:'https://picsum.photos/seed/s2/200',score:4.4,schedule:{days:[],duration:60, timesByDay:{}}},
      {id:'s3',name:'کاشت مژه',    price:420000,duration:120,image:'https://picsum.photos/seed/s3/200',score:4.8,schedule:{days:[],duration:120,timesByDay:{}}},
    ],
  },
  default:{
    bio:'ارائه خدمات تخصصی زیبایی با کادر مجرب',
    address:'تهران',
    avgScore:4.0, scoreDist:{5:40,4:30,3:20,2:7,1:3}, totalBookings:100,
    team:[{id:'td1',name:'متخصص',role:'کارشناس',avatar:'https://i.pravatar.cc/80?img=20'}],
    portfolio:[
      'https://picsum.photos/seed/dp1/300/300','https://picsum.photos/seed/dp2/300/300',
      'https://picsum.photos/seed/dp3/300/300',
    ],
    reviews:[{id:'dr1',userName:'کاربر',avatar:'https://i.pravatar.cc/60?img=30',score:4.0,comment:'خدمات خوب بود.',date:'۱۴۰۳/۱۱/۰۱',serviceName:'خدمت اصلی'}],
    services:[
      {id:'d1',name:'مشاوره اولیه',price:50000, duration:30,image:'https://picsum.photos/seed/d1/200',score:4.0,schedule:{days:[],duration:30,timesByDay:{}}},
      {id:'d2',name:'خدمت تخصصی', price:200000,duration:60,image:'https://picsum.photos/seed/d2/200',score:4.0,schedule:{days:[],duration:60,timesByDay:{}}},
    ],
  },
};

const CELL=40;
const PF_SIZE=(SW-36-8)/3;

// ════════════════════════════════════════════════════
const BusinessProfileModal=({visible,provider,onClose,onBooked})=>{
  const insets=useSafeAreaInsets();
  const [step,setStep]         =useState('profile');
  const [selService,setSelSvc] =useState(null);
  const [selDay,setSelDay]     =useState(null);
  const [selTime,setSelTime]   =useState(null);
  const [today]                =useState(todayJ);
  const [year,setYear]         =useState(today[0]);
  const [month,setMonth]       =useState(today[1]);
  const [pfImg,setPfImg]       =useState(null);

  const biz      =provider?(BIZ[provider.id]??BIZ.default):BIZ.default;
  const services =biz.services;
  const schedule =selService?.schedule??{days:[],duration:60,timesByDay:{}};

  const days  =daysInJ(month,year);
  const offset=firstWday(year,month);
  const cells =Array(offset).fill(null).concat(Array.from({length:days},(_,i)=>i+1));
  const rows  =[]; for(let i=0;i<cells.length;i+=7) rows.push(cells.slice(i,i+7));

  const dKey =(d)=>`${year}/${String(month).padStart(2,'0')}/${String(d).padStart(2,'0')}`;
  const isPast=(d)=>{const[ty,tm,td]=today;return year<ty||(year===ty&&month<tm)||(year===ty&&month===tm&&d<td);};
  const isAvail=(d)=>!schedule.days.length||schedule.days.includes(dKey(d));

  const availTimes=useMemo(()=>{
    if(!selDay) return [];
    const t=schedule.timesByDay[selDay];
    if(t&&t.length) return t;
    const dur=schedule.duration||60;
    const sl=[];let m=8*60;
    while(m+dur<=21*60){sl.push(`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`);m+=dur;}
    return sl;
  },[selDay,selService]);

  const prevMonth=()=>month===1?(setMonth(12),setYear(y=>y-1)):setMonth(m=>m-1);
  const nextMonth=()=>month===12?(setMonth(1),setYear(y=>y+1)):setMonth(m=>m+1);
  const reset=()=>{setStep('profile');setSelSvc(null);setSelDay(null);setSelTime(null);setPfImg(null);};
  const close=()=>{reset();onClose();};

  const handleBook=()=>{
    onBooked?.({
      id:`bk${Date.now()}`,providerId:provider.id,provider:provider.name,
      subtitle:selService.name,date:selDay,time:selTime,
      avatar:provider.avatar,price:selService.price,status:'pending',message:'',
    });
    setStep('success');
  };

  const sc=biz.avgScore;
  const scColor=sc>=4?'#4CAF50':sc>=3?COLORS.gold:COLORS.red;
  const scLabel=sc>=4.5?'عالی':sc>=4?'خوب':sc>=3?'متوسط':'ضعیف';
  const total=provider?.reviewCount??0;

  if(!provider) return null;

  return(
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={close}><View style={s.overlay}/></TouchableWithoutFeedback>

      <View style={[s.sheet,{paddingBottom:Math.max(insets.bottom,24)}]}>
        <View style={s.handle}/>

        {/* ══ PROFILE ══════════════════════════════════ */}
        {step==='profile'&&(
          <>
            <View style={s.header}>
              <TouchableOpacity onPress={close} hitSlop={{top:8,bottom:8,left:8,right:8}}>
                <Icon name="close" size={22} color={COLORS.textSub}/>
              </TouchableOpacity>
              <Text style={s.headerTitle}>پروفایل کسب‌وکار</Text>
              <Icon name="storefront-outline" size={22} color={COLORS.gold}/>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{paddingBottom:8}}>

              {/* Hero */}
              <View style={s.hero}>
                <View style={s.avatarGlow}>
                  <Image source={{uri:provider.avatar}} style={s.avatar}/>
                  {provider.isOnline&&(
                    <View style={s.onlineBadge}>
                      <View style={s.onlineDot}/>
                      <Text style={s.onlineTxt}>آنلاین</Text>
                    </View>
                  )}
                </View>
                <Text style={s.provName}>{provider.name}</Text>
                <Text style={s.provCat}>{provider.category}</Text>
                <View style={s.metaRow}>
                  <Icon name="star" size={14} color={COLORS.gold}/>
                  <Text style={s.metaGold}>{provider.rating}</Text>
                  <Text style={s.metaSub}>({provider.reviewCount} نظر)</Text>
                  {provider.distance&&<><View style={s.midDot}/><Icon name="location-outline" size={13} color={COLORS.textSub}/><Text style={s.metaSub}>{provider.distance}</Text></>}
                </View>
              </View>

              {/* آدرس */}
              {biz.address&&(
                <View style={s.infoRow}>
                  <Icon name="location-outline" size={15} color={COLORS.gold}/>
                  <Text style={s.infoTxt}>{biz.address}</Text>
                </View>
              )}

              {/* بیو */}
              {biz.bio&&(
                <View style={s.bioBox}>
                  <Text style={s.bioTxt}>{biz.bio}</Text>
                </View>
              )}

              {/* آمار ۳ تا */}
              <View style={s.statsRow}>
                <StatBox val={provider.reviewCount} lbl="نظر"/>
                <View style={s.sDiv}/>
                <StatBox val={biz.totalBookings} lbl="رزرو"/>
                <View style={s.sDiv}/>
                <StatBox val={services.length} lbl="خدمت"/>
              </View>

              {/* تگ‌ها */}
              {provider.tags?.length>0&&(
                <View style={s.tagsWrap}>
                  {provider.tags.map(t=><View key={t} style={s.tag}><Text style={s.tagTxt}>{t}</Text></View>)}
                </View>
              )}

              {/* ── امتیاز ── */}
              <SecLabel icon="bar-chart-outline" title="امتیاز و نظرات"/>
              <View style={s.scoreCard}>
                <View style={s.scoreLeft}>
                  <Text style={[s.scoreBig,{color:scColor}]}>{sc.toFixed(1)}</Text>
                  <Text style={s.scoreOf}>از ۵</Text>
                  <View style={[s.scoreBadge,{backgroundColor:scColor+'22',borderColor:scColor+'66'}]}>
                    <Text style={[s.scoreBadgeTxt,{color:scColor}]}>{scLabel}</Text>
                  </View>
                  <Text style={s.scoreTotal}>{total} نظر</Text>
                </View>
                <View style={s.sDiv}/>
                <View style={s.barsCol}>
                  {[5,4,3,2,1].map(n=>{
                    const cnt=biz.scoreDist[n]??0;
                    const pct=total>0?(cnt/total)*100:0;
                    const bc=n>=4?'#4CAF50':n===3?COLORS.gold:COLORS.red;
                    return(
                      <View key={n} style={s.barRow}>
                        <Text style={s.barLbl}>{cnt}</Text>
                        <View style={s.track}><View style={[s.fill,{width:`${pct}%`,backgroundColor:bc}]}/></View>
                        <Text style={s.barNum}>{n}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* نظرات */}
              {biz.reviews.slice(0,3).map(rv=>{
                const rc=rv.score>=4?'#4CAF50':rv.score>=3?COLORS.gold:COLORS.red;
                return(
                  <View key={rv.id} style={s.rvCard}>
                    <View style={s.rvTop}>
                      <View style={s.rvRight}>
                        <Text style={s.rvName}>{rv.userName}</Text>
                        <Text style={s.rvSvc}>{rv.serviceName}</Text>
                      </View>
                      <View style={s.rvLeft}>
                        <Image source={{uri:rv.avatar}} style={s.rvAvatar}/>
                        <View style={[s.rvBadge,{backgroundColor:rc}]}>
                          <Text style={s.rvScore}>{rv.score.toFixed(1)}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={s.rvComment}>{rv.comment}</Text>
                    <Text style={s.rvDate}>{rv.date}</Text>
                  </View>
                );
              })}

              {/* ── تیم ── */}
              <SecLabel icon="people-outline" title="اعضای تیم"/>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.teamRow}>
                {biz.team.map(m=>(
                  <View key={m.id} style={s.teamCard}>
                    <Image source={{uri:m.avatar}} style={s.teamAvatar}/>
                    <Text style={s.teamName} numberOfLines={1}>{m.name}</Text>
                    <Text style={s.teamRole} numberOfLines={1}>{m.role}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* ── نمونه کارها ── */}
              <SecLabel icon="images-outline" title="نمونه کارها"/>
              <View style={s.pfGrid}>
                {biz.portfolio.map((img,i)=>(
                  <TouchableOpacity key={i} onPress={()=>setPfImg(img)} activeOpacity={0.85}>
                    <Image source={{uri:img}} style={[s.pfCell,{width:PF_SIZE,height:PF_SIZE}]} resizeMode="cover"/>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            {/* دکمه رزرو ثابت پایین */}
            <TouchableOpacity style={s.bookBtn} onPress={()=>setStep('service')} activeOpacity={0.85}>
              <Icon name="calendar-outline" size={18} color={COLORS.background}/>
              <Text style={s.bookBtnTxt}>رزرو نوبت</Text>
            </TouchableOpacity>

            {/* lightbox نمونه کار */}
            {pfImg&&(
              <TouchableOpacity style={s.lightbox} onPress={()=>setPfImg(null)} activeOpacity={1}>
                <Image source={{uri:pfImg}} style={s.lightboxImg} resizeMode="contain"/>
                <TouchableOpacity style={s.lightboxClose} onPress={()=>setPfImg(null)}>
                  <Icon name="close-circle" size={32} color="#fff"/>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* ══ SERVICE ══════════════════════════════════ */}
        {step==='service'&&(
          <>
            <StepHdr title="انتخاب خدمت" sub={provider.name} onBack={()=>setStep('profile')} onClose={close}/>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {services.map(svc=>(
                <TouchableOpacity key={svc.id}
                  style={[s.svcCard,selService?.id===svc.id&&s.svcCardSel]}
                  onPress={()=>setSelSvc(svc)} activeOpacity={0.85}>
                  <Image source={{uri:svc.image}} style={s.svcImg} resizeMode="cover"/>
                  <View style={s.svcBody}>
                    <Text style={s.svcName}>{svc.name}</Text>
                    <View style={s.svcMeta}>
                      <View style={s.svcChip}>
                        <Icon name="time-outline" size={12} color={COLORS.textSub}/>
                        <Text style={s.svcMetaTxt}>{svc.duration} دقیقه</Text>
                      </View>
                      <View style={[s.svcChip,{borderColor:'rgba(212,175,55,0.4)'}]}>
                        <Icon name="cash-outline" size={12} color={COLORS.gold}/>
                        <Text style={[s.svcMetaTxt,{color:COLORS.gold}]}>{svc.price.toLocaleString()} ت</Text>
                      </View>
                    </View>
                    {svc.score>0&&(
                      <View style={[s.svcScore,{backgroundColor:svc.score>=4?'#4CAF50':svc.score>=3?COLORS.gold:COLORS.red}]}>
                        <Text style={s.svcScoreTxt}>{svc.score.toFixed(1)}</Text>
                      </View>
                    )}
                  </View>
                  {selService?.id===svc.id&&<View style={s.checkCircle}><Icon name="checkmark" size={14} color={COLORS.background}/></View>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[s.nextBtn,!selService&&s.nextBtnDim]}
              onPress={()=>selService&&setStep('datetime')} activeOpacity={0.85}>
              <Text style={s.nextBtnTxt}>ادامه</Text>
              <Icon name="arrow-back" size={18} color={COLORS.background}/>
            </TouchableOpacity>
          </>
        )}

        {/* ══ DATETIME ═════════════════════════════════ */}
        {step==='datetime'&&(
          <>
            <StepHdr title="انتخاب روز و ساعت" sub={selService?.name} onBack={()=>setStep('service')} onClose={close}/>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              <View style={s.nav}>
                <TouchableOpacity onPress={nextMonth} style={s.navBtn}><Icon name="chevron-forward" size={22} color={COLORS.gold}/></TouchableOpacity>
                <Text style={s.monthLbl}>{JM[month-1]}  {year}</Text>
                <TouchableOpacity onPress={prevMonth} style={s.navBtn}><Icon name="chevron-back" size={22} color={COLORS.gold}/></TouchableOpacity>
              </View>
              <View style={s.weekRow}>{WD.map(w=><Text key={w} style={s.wday}>{w}</Text>)}</View>
              {rows.map((row,ri)=>(
                <View key={ri} style={s.calRow}>
                  {[...row,...Array(7-row.length).fill(null)].map((day,ci)=>{
                    if(!day) return <View key={`e${ri}${ci}`} style={s.calCell}/>;
                    const k=dKey(day),isSel=selDay===k,p=isPast(day),av=isAvail(day),isToday=year===today[0]&&month===today[1]&&day===today[2];
                    return(
                      <TouchableOpacity key={k}
                        style={[s.calCell,isSel&&s.calCellSel,isToday&&!isSel&&s.calCellToday,(p||!av)&&s.calCellDim]}
                        onPress={()=>{if(!p&&av){setSelDay(k);setSelTime(null);}}}
                        activeOpacity={(p||!av)?1:0.7}>
                        <Text style={[s.calDay,isSel&&s.calDaySel,(p||!av)&&s.calDayDim,isToday&&!isSel&&s.calDayToday]}>{day}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
              {selDay&&(
                <View style={s.timesSection}>
                  <Text style={s.timesTitle}>ساعت‌های موجود:</Text>
                  <View style={s.timesGrid}>
                    {availTimes.map(t=>(
                      <TouchableOpacity key={t} style={[s.timeChip,selTime===t&&s.timeChipSel]} onPress={()=>setSelTime(t)} activeOpacity={0.75}>
                        <Text style={[s.timeTxt,selTime===t&&s.timeTxtSel]}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {!availTimes.length&&<Text style={s.noTimeTxt}>در این روز نوبت موجود نیست</Text>}
                </View>
              )}
            </ScrollView>
            <TouchableOpacity style={[s.nextBtn,(!selDay||!selTime)&&s.nextBtnDim]}
              onPress={()=>selDay&&selTime&&setStep('confirm')} activeOpacity={0.85}>
              <Text style={s.nextBtnTxt}>ادامه</Text>
              <Icon name="arrow-back" size={18} color={COLORS.background}/>
            </TouchableOpacity>
          </>
        )}

        {/* ══ CONFIRM ══════════════════════════════════ */}
        {step==='confirm'&&(
          <>
            <StepHdr title="تأیید رزرو" sub="بررسی جزئیات" onBack={()=>setStep('datetime')} onClose={close}/>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              <View style={s.confirmCard}>
                <CRow icon="storefront-outline" label="کسب‌وکار" val={provider.name}/>
                <CRow icon="cut-outline"        label="خدمت"     val={selService?.name}/>
                <CRow icon="calendar-outline"   label="تاریخ"    val={selDay}/>
                <CRow icon="time-outline"       label="ساعت"     val={selTime}/>
                <CRow icon="cash-outline"       label="هزینه"    val={`${selService?.price?.toLocaleString()} تومان`} gold/>
              </View>
              <View style={s.warningBox}>
                <Icon name="information-circle-outline" size={16} color={COLORS.gold}/>
                <Text style={s.warningTxt}>این رزرو نیاز به تأیید صاحب کسب‌وکار دارد. وضعیت را در پروفایل پیگیری کنید.</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={s.nextBtn} onPress={handleBook} activeOpacity={0.85}>
              <Icon name="checkmark-circle-outline" size={18} color={COLORS.background}/>
              <Text style={s.nextBtnTxt}>ثبت نهایی رزرو</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ══ SUCCESS ══════════════════════════════════ */}
        {step==='success'&&(
          <View style={s.successWrap}>
            <Icon name="checkmark-circle" size={72} color={COLORS.gold}/>
            <Text style={s.successTitle}>نوبت شما ثبت شد!</Text>
            <Text style={s.successSub}>می‌توانید در پروفایل، بخش «درخواست‌های من»، وضعیت درخواست خود را پیگیری کنید.</Text>
            <View style={s.confirmCard}>
              <CRow icon="storefront-outline" label="کسب‌وکار" val={provider.name}/>
              <CRow icon="cut-outline"        label="خدمت"     val={selService?.name}/>
              <CRow icon="calendar-outline"   label="تاریخ"    val={selDay}/>
              <CRow icon="time-outline"       label="ساعت"     val={selTime}/>
            </View>
            <TouchableOpacity style={s.nextBtn} onPress={close} activeOpacity={0.85}>
              <Icon name="checkmark" size={18} color={COLORS.background}/>
              <Text style={s.nextBtnTxt}>متوجه شدم</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

// ── کامپوننت‌های کمکی ────────────────────────────
const SecLabel=({icon,title})=>(
  <View style={s.secLabel}>
    <View style={s.secLine}/>
    <Text style={s.secTitle}>{title}</Text>
    <Icon name={icon} size={16} color={COLORS.gold}/>
  </View>
);
const StatBox=({val,lbl})=>(<View style={s.statBox}><Text style={s.statVal}>{val}</Text><Text style={s.statLbl}>{lbl}</Text></View>);
const StepHdr=({title,sub,onBack,onClose})=>(
  <View style={s.stepHeader}>
    <TouchableOpacity onPress={onBack} hitSlop={{top:8,bottom:8,left:8,right:8}}><Icon name="arrow-back" size={22} color={COLORS.textSub}/></TouchableOpacity>
    <View style={s.stepMid}>
      <Text style={s.stepTitle}>{title}</Text>
      {sub&&<Text style={s.stepSub} numberOfLines={1}>{sub}</Text>}
    </View>
    <TouchableOpacity onPress={onClose} hitSlop={{top:8,bottom:8,left:8,right:8}}><Icon name="close" size={22} color={COLORS.textSub}/></TouchableOpacity>
  </View>
);
const CRow=({icon,label,val,gold})=>(
  <View style={s.confRow}>
    <Text style={[s.confVal,gold&&{color:COLORS.gold,fontFamily:FONTS.bold}]}>{val}</Text>
    <Text style={s.confLbl}>{label}</Text>
    <Icon name={icon} size={16} color={gold?COLORS.gold:COLORS.textSub}/>
  </View>
);

// ── استایل‌ها ────────────────────────────────────
const s=StyleSheet.create({
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.72)'},
  sheet:{backgroundColor:COLORS.surface,borderTopLeftRadius:28,borderTopRightRadius:28,paddingHorizontal:18,maxHeight:'94%'},
  handle:{width:40,height:4,backgroundColor:COLORS.border,borderRadius:2,alignSelf:'center',marginTop:10,marginBottom:4},

  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:COLORS.border},
  headerTitle:{color:COLORS.textMain,fontSize:15,fontFamily:FONTS.bold},

  hero:{alignItems:'center',paddingTop:18,paddingBottom:14,gap:5},
  avatarGlow:{width:94,height:94,borderRadius:47,borderWidth:3,borderColor:COLORS.gold,justifyContent:'center',alignItems:'center',shadowColor:COLORS.gold,shadowOffset:{width:0,height:0},shadowOpacity:0.5,shadowRadius:12,elevation:8},
  avatar:{width:86,height:86,borderRadius:43},
  onlineBadge:{position:'absolute',bottom:-6,flexDirection:'row',alignItems:'center',gap:4,backgroundColor:COLORS.surface,paddingHorizontal:8,paddingVertical:3,borderRadius:RADII.round,borderWidth:1,borderColor:'#4CAF50'},
  onlineDot:{width:7,height:7,borderRadius:4,backgroundColor:'#4CAF50'},
  onlineTxt:{color:'#4CAF50',fontSize:10,fontFamily:FONTS.bold},
  provName:{color:COLORS.textMain,fontSize:20,fontFamily:FONTS.bold},
  provCat:{color:COLORS.gold,fontSize:13,fontFamily:FONTS.regular},
  metaRow:{flexDirection:'row',alignItems:'center',gap:5},
  metaGold:{color:COLORS.gold,fontSize:14,fontFamily:FONTS.bold},
  metaSub:{color:COLORS.textSub,fontSize:11,fontFamily:FONTS.regular},
  midDot:{width:3,height:3,borderRadius:2,backgroundColor:COLORS.border},

  infoRow:{flexDirection:'row-reverse',alignItems:'center',gap:7,paddingHorizontal:4,paddingBottom:8},
  infoTxt:{flex:1,color:COLORS.textSub,fontSize:12,fontFamily:FONTS.regular,textAlign:'right'},
  bioBox:{backgroundColor:COLORS.background,borderRadius:RADII.md,borderWidth:1,borderColor:COLORS.border,padding:12,marginBottom:14},
  bioTxt:{color:COLORS.textSub,fontSize:13,fontFamily:FONTS.regular,textAlign:'right',lineHeight:22},

  statsRow:{flexDirection:'row',backgroundColor:COLORS.background,borderRadius:RADII.lg,borderWidth:1,borderColor:COLORS.border,paddingVertical:12,marginBottom:14},
  statBox:{flex:1,alignItems:'center',gap:3},
  statVal:{color:COLORS.textMain,fontSize:18,fontFamily:FONTS.bold},
  statLbl:{color:COLORS.textSub,fontSize:11,fontFamily:FONTS.regular},
  sDiv:{width:1,backgroundColor:COLORS.border,marginVertical:4},

  tagsWrap:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:7,paddingBottom:14},
  tag:{paddingHorizontal:11,paddingVertical:5,borderRadius:RADII.round,backgroundColor:'rgba(212,175,55,0.1)',borderWidth:1,borderColor:'rgba(212,175,55,0.3)'},
  tagTxt:{color:COLORS.gold,fontSize:12,fontFamily:FONTS.regular},

  secLabel:{flexDirection:'row-reverse',alignItems:'center',gap:8,paddingVertical:12},
  secTitle:{color:COLORS.textMain,fontSize:14,fontFamily:FONTS.bold,flex:1,textAlign:'right'},
  secLine:{height:1,backgroundColor:COLORS.border,width:30},

  scoreCard:{flexDirection:'row-reverse',backgroundColor:COLORS.background,borderRadius:RADII.lg,borderWidth:1,borderColor:COLORS.border,padding:14,gap:14,marginBottom:10},
  scoreLeft:{alignItems:'center',gap:3,minWidth:66},
  scoreBig:{fontSize:48,fontFamily:FONTS.bold,lineHeight:54},
  scoreOf:{color:COLORS.textSub,fontSize:11,fontFamily:FONTS.regular},
  scoreBadge:{marginTop:2,paddingHorizontal:9,paddingVertical:3,borderRadius:RADII.round,borderWidth:1},
  scoreBadgeTxt:{fontSize:11,fontFamily:FONTS.bold},
  scoreTotal:{color:COLORS.textSub,fontSize:10,fontFamily:FONTS.regular,marginTop:2},
  barsCol:{flex:1,gap:7},
  barRow:{flexDirection:'row-reverse',alignItems:'center',gap:5},
  barNum:{color:COLORS.textSub,fontSize:11,fontFamily:FONTS.bold,width:13,textAlign:'center'},
  track:{flex:1,height:6,backgroundColor:COLORS.border,borderRadius:3,overflow:'hidden'},
  fill:{height:'100%',borderRadius:3},
  barLbl:{color:COLORS.textSub,fontSize:10,fontFamily:FONTS.regular,width:20,textAlign:'left'},

  rvCard:{backgroundColor:COLORS.background,borderRadius:RADII.md,borderWidth:1,borderColor:COLORS.border,padding:12,marginBottom:8,gap:6},
  rvTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},
  rvRight:{flex:1,alignItems:'flex-end',gap:2},
  rvLeft:{alignItems:'center',gap:4,marginLeft:10},
  rvName:{color:COLORS.textMain,fontSize:13,fontFamily:FONTS.bold},
  rvSvc:{color:COLORS.gold,fontSize:10,fontFamily:FONTS.regular},
  rvAvatar:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:COLORS.border},
  rvBadge:{paddingHorizontal:6,paddingVertical:2,borderRadius:RADII.round,minWidth:30,alignItems:'center'},
  rvScore:{color:'#FFF',fontSize:11,fontFamily:FONTS.bold},
  rvComment:{color:COLORS.textSub,fontSize:12,fontFamily:FONTS.regular,textAlign:'right',lineHeight:19},
  rvDate:{color:COLORS.border,fontSize:10,fontFamily:FONTS.regular,textAlign:'left'},

  teamRow:{gap:12,paddingBottom:6,paddingRight:2},
  teamCard:{alignItems:'center',gap:5,width:74},
  teamAvatar:{width:62,height:62,borderRadius:31,borderWidth:2,borderColor:COLORS.gold},
  teamName:{color:COLORS.textMain,fontSize:11,fontFamily:FONTS.bold,textAlign:'center'},
  teamRole:{color:COLORS.gold,fontSize:10,fontFamily:FONTS.regular,textAlign:'center'},

  pfGrid:{flexDirection:'row',flexWrap:'wrap',gap:4,marginBottom:8},
  pfCell:{borderRadius:RADII.sm,backgroundColor:COLORS.border},

  lightbox:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.93)',justifyContent:'center',alignItems:'center',zIndex:999},
  lightboxImg:{width:SW-36,height:SW-36,borderRadius:RADII.md},
  lightboxClose:{position:'absolute',top:16,right:16},

  bookBtn:{backgroundColor:COLORS.gold,height:52,borderRadius:RADII.lg,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8,marginTop:8,...SHADOWS.goldButton},
  bookBtnTxt:{color:COLORS.background,fontSize:15,fontFamily:FONTS.bold},

  stepHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:COLORS.border},
  stepMid:{alignItems:'center',flex:1,gap:2},
  stepTitle:{color:COLORS.textMain,fontSize:15,fontFamily:FONTS.bold},
  stepSub:{color:COLORS.gold,fontSize:11,fontFamily:FONTS.regular},

  svcCard:{flexDirection:'row-reverse',backgroundColor:COLORS.background,borderRadius:RADII.lg,borderWidth:1,borderColor:COLORS.border,overflow:'hidden',marginVertical:5,alignItems:'center'},
  svcCardSel:{borderColor:COLORS.gold,backgroundColor:'rgba(212,175,55,0.05)'},
  svcImg:{width:80,height:80},
  svcBody:{flex:1,padding:12,alignItems:'flex-end',gap:5},
  svcName:{color:COLORS.textMain,fontSize:14,fontFamily:FONTS.bold},
  svcMeta:{flexDirection:'row',gap:8,justifyContent:'flex-end'},
  svcChip:{flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:8,paddingVertical:3,borderRadius:RADII.round,borderWidth:1,borderColor:COLORS.border},
  svcMetaTxt:{color:COLORS.textSub,fontSize:11,fontFamily:FONTS.regular},
  svcScore:{paddingHorizontal:7,paddingVertical:2,borderRadius:RADII.round,minWidth:34,alignItems:'center'},
  svcScoreTxt:{color:'#FFF',fontSize:11,fontFamily:FONTS.bold},
  checkCircle:{width:28,height:28,borderRadius:14,backgroundColor:COLORS.gold,justifyContent:'center',alignItems:'center',marginRight:12},

  nav:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10},
  navBtn:{width:34,height:34,justifyContent:'center',alignItems:'center'},
  monthLbl:{color:COLORS.textMain,fontSize:15,fontFamily:FONTS.bold},
  weekRow:{flexDirection:'row',paddingBottom:4},
  wday:{width:`${100/7}%`,textAlign:'center',color:COLORS.textSub,fontSize:11,fontFamily:FONTS.bold},
  calRow:{flexDirection:'row'},
  calCell:{width:`${100/7}%`,height:CELL,justifyContent:'center',alignItems:'center'},
  calCellSel:{backgroundColor:COLORS.gold,borderRadius:9},
  calCellToday:{borderWidth:1.5,borderColor:COLORS.gold,borderRadius:9},
  calCellDim:{opacity:0.22},
  calDay:{color:COLORS.textMain,fontSize:13,fontFamily:FONTS.regular},
  calDaySel:{color:COLORS.background,fontFamily:FONTS.bold},
  calDayDim:{color:COLORS.textSub},
  calDayToday:{color:COLORS.gold,fontFamily:FONTS.bold},

  timesSection:{paddingTop:14,gap:10},
  timesTitle:{color:COLORS.textSub,fontSize:12,fontFamily:FONTS.bold,textAlign:'right'},
  timesGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,justifyContent:'flex-end'},
  timeChip:{paddingHorizontal:16,paddingVertical:10,borderRadius:RADII.md,borderWidth:1,borderColor:COLORS.border,backgroundColor:COLORS.background},
  timeChipSel:{borderColor:COLORS.gold,backgroundColor:'rgba(212,175,55,0.12)'},
  timeTxt:{color:COLORS.textSub,fontSize:13,fontFamily:FONTS.regular},
  timeTxtSel:{color:COLORS.gold,fontFamily:FONTS.bold},
  noTimeTxt:{color:COLORS.textSub,fontSize:12,fontFamily:FONTS.regular,textAlign:'center',paddingVertical:10},

  confirmCard:{backgroundColor:COLORS.background,borderRadius:RADII.lg,borderWidth:1,borderColor:COLORS.border,padding:16,gap:14,marginTop:8},
  confRow:{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',gap:10},
  confLbl:{color:COLORS.textSub,fontSize:12,fontFamily:FONTS.regular,width:60,textAlign:'right'},
  confVal:{flex:1,color:COLORS.textMain,fontSize:13,fontFamily:FONTS.regular,textAlign:'left'},
  warningBox:{flexDirection:'row',gap:8,backgroundColor:'rgba(212,175,55,0.08)',borderRadius:RADII.md,borderWidth:1,borderColor:'rgba(212,175,55,0.25)',padding:12,marginTop:14,alignItems:'flex-start'},
  warningTxt:{flex:1,color:COLORS.textSub,fontSize:11,fontFamily:FONTS.regular,textAlign:'right',lineHeight:18},

  successWrap:{alignItems:'center',paddingVertical:20,gap:14},
  successTitle:{color:COLORS.textMain,fontSize:22,fontFamily:FONTS.bold},
  successSub:{color:COLORS.textSub,fontSize:13,fontFamily:FONTS.regular,textAlign:'center',lineHeight:22,paddingHorizontal:10},

  nextBtn:{backgroundColor:COLORS.gold,height:52,borderRadius:RADII.lg,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8,marginTop:8,...SHADOWS.goldButton},
  nextBtnDim:{opacity:0.45},
  nextBtnTxt:{color:COLORS.background,fontSize:15,fontFamily:FONTS.bold},
});

export default BusinessProfileModal;