const video_cont = document.querySelector('.container_vid')
const video = document.getElementById('video');
const files_list = document.querySelector('#list')
const new_drag = qsa('.more_files')
const drag_intro = document.querySelector('.drag_intro')
const file_upload = document.querySelector('#file_upload')
const fullbtn = document.querySelector('.container_vid>button#togglefull')
const backbar = qs('.backbar')
let autoplay_el = qs('#autoplay')
const showinfo = qs('.container_vid h5[style]')
let shuffle = qs('#shuffle')
let curr_play_ind=0;
let videofiles = [];
let removed = []
let li_list,backwidth;
let sel_el,prev_sel_el;
//player functionality
let [random,autoresume,autoplay] = [false,false,true]
//fetching meta data
let meta_vid = document.querySelector('#meta_video')
let meta_iter = 0;
// get controls
const [play,back,prev,next,forward,iTag,fill,curr_time,ctr_vis,vol_disp]=[geid('play'),geid('backward'),geid('prev'),geid('next'),geid('forward'),qsa('.play_disp'),qs('.fill'),qs('#curr_time'),qsa('.ctr_vis'),qs('.vol_disp')]

// fullscreen functionality
let isFullscreen = false
fullbtn.onclick=_=>{
    (!isFullscreen)?video_cont.requestFullscreen():document.exitFullscreen()
}
document.addEventListener('fullscreenchange',_=>{
    if(document.fullscreenElement){
        isFullscreen=true;
        video.classList.add('fullscreen')
        showtemp(showinfo,10)
        screen.orientation.lock('landscape')
        fullbtn.innerHTML = `<i class="fa fa-compress"></i>`
    }else{
        isFullscreen = false
        video.classList.remove('fullscreen')
        showinfo.classList.add('noshow')
        fullbtn.innerHTML = `<i class="fa fa-expand"></i>`
    }
})

// drag and drop
drag_intro.addEventListener('dragenter',dragenter,false)
drag_intro.addEventListener('dragover',dragover,false)
drag_intro.addEventListener('drop',drop,false)
drag_intro.addEventListener('click', click_simulator,false)
window.addEventListener('dragenter',dragenter,false)
window.addEventListener('dragover',dragover,false)
window.addEventListener('drop',drop, false)
new_drag.forEach(el=>{el.addEventListener('click',click_simulator,false)})
window.addEventListener('resize',_=>backwidth =!!videofiles.length? backbar.getClientRects()[0].width:0,false)
files_list.addEventListener('click',playthis,false)
// the upload file function
file_upload.addEventListener('change',function(e){
    !videofiles.length?handleFile(e.target.files):updatelist(e.target.files)
},false)
//e check if vid playback has ended
video.addEventListener('ended', nextvid,false)
//e for autoplay toggle
autoplay_el.onclick = function(){
    autoplay = this.checked
    video.autoplay=autoplay
    let auto_disp = autoplay_el.previousElementSibling.classList
    autoplay?auto_disp.replace('fa-ban','fa-greater-than'):auto_disp.replace('fa-greater-than','fa-ban')
}
//e for shuffle
shuffle.addEventListener('click',shuffleFn,false)
video.addEventListener('error',nextvid,false)



//FUNCTIONS
function stop(e){
    e.preventDefault();
    e.stopPropagation()
}

function dragenter(e){
    stop(e)
}
function dragover(e){
    stop(e)
}
function drop(e){
    stop(e)
    let files = e.dataTransfer.files;
    !videofiles.length?handleFile(files):updatelist(files)
}

//simulating the upload file with the window
function click_simulator(){
    file_upload.click()
}
//fn adding to video list
function updatelist(files){
    for(let i=0;i<files.length;i++){
        if(!files[i].type.startsWith('video'))return;
        videofiles.push(files[i])
        files_list.innerHTML += `<li class-"collection-item" id="${videofiles.length-1}">${files[i].name} <button onclick="delVid(${videofiles.length-1})" class="del-btn fa fa-minus"></button> </li>`
    }
    setTimeout(() => {
        if(videofiles.length)fetch_meta()
    }, 0);
}

// handling files
let duration = [];
function handleFile(files){
    updatelist(files)
    if(!videofiles.length)return;
    li_list=qsa('#list li')
    setVideo()
    changestyle('display','block',video_cont,files_list)
    changestyle('display','none',drag_intro)
    changestyle('display','block',new_drag[0])
}

// fn setting the vid to play
function setVideo(){
    if(removed.some(i=>i===curr_play_ind)){
        if(arguments.length){
        nextvid('prev')
        }else nextvid();
        return;
    }
    video.setAttribute('src',URL.createObjectURL(videofiles[curr_play_ind]))
    setTimeout(() => {
        backwidth = backbar.getClientRects()[0].width;
        let el = geid(curr_play_ind)
        el.classList.add('nowplaying')
        el.scrollIntoView({behavior:'smooth',block:'start'})
    }, 0);
  
}
//fn delete video
function delVid(i){
    if(videofiles.length-1===removed.length)return;
    // log(videofiles.length,removed.length)
    if(i===curr_play_ind)nextvid();
    removed.push(i)
    videofiles[i]='deleted'
    geid(`${i}`).remove()
}
// play next video
function nextvid(playnext=""){
    if(videofiles.length===0)renew()
    if(random)playnext="shuffle";
    URL.revokeObjectURL(videofiles[curr_play_ind])
    let firstChild = files_list.firstElementChild.getAttribute('id')
    let lastChild = files_list.lastElementChild.getAttribute('id')
    switch (playnext) {
        case 'prev':
            if(!(firstChild==curr_play_ind)){
                curr_play_ind=parseInt(qs('.nowplaying').previousElementSibling.getAttribute('id'))
                setVideo('prev')
            }else {
                curr_play_ind=parseInt(lastChild)
                setVideo()
            }
            break;
            case 'shuffle':
            let rand = Math.floor(Math.random()*li_list.length)
            curr_play_ind=parseInt(li_list[rand].getAttribute('id'))
            setVideo()
            break;
            default:
                if(geid(curr_play_ind)!==geid(lastChild)){
                curr_play_ind=parseInt(qs('.nowplaying').nextElementSibling.getAttribute('id'))
                setVideo()
            }else {
                curr_play_ind=parseInt(firstChild)
                setVideo()
            }
            break;
    }
    if(qsa('#list li').length!==1)qs('.nowplaying').classList.remove('nowplaying')
    // setTimeout(() => {
    //     // li_list[curr_play_ind].classList.add('nowplaying')      
    // }, 0);
    
}
//fn renw everthing
// function renew(){
//     video.removeAttribute('src')
//     videofiles=[]
//     curr_play_ind=0;
//     li_list.innerHTML=''
//     removed=[]
//     meta_iter=0
//     log(videofiles,removed,curr_play_ind,meta_iter)
//     changestyle('display','none',video_cont,files_list)
//     changestyle('display','block',drag_intro)
//     changestyle('display','none',new_drag[0])
//     return;
// }

//fn for playing a video based on an index
function playthis(e){
    let target_num
    if(e.target.nodeName=='DIV'){
        target_num = parseInt(e.target.parentElement.getAttribute('id'))
    }else if(e.target.nodeName=='LI'){
        target_num = parseInt(e.target.getAttribute('id'))
    }else return;
    if(curr_play_ind!==target_num){
        qs('.nowplaying').classList.remove('nowplaying')
        curr_play_ind=target_num
        setVideo()
    }
}
//fn show, hide elements
function changestyle(){
  let el_arr = [...arguments];
  let prop = el_arr.shift()
  let style_val = el_arr.shift()
  el_arr.forEach(el=>{
    el.style[prop] = style_val
  })
}
//fn show temp
function showtemp(){
  let el_arr = [...arguments];
  let timeout = el_arr.pop()
  el_arr.forEach(el=>{
    el = el.length?el[0]:el
    el.classList.remove('noshow')
    el.style.animation = `showTem ${timeout}s linear forwards`;
    el.addEventListener('animationend',function(){
        el.classList.add('noshow')
        el.style.animation = '';
    },{once:true})
  })
}
//fetch the time of the file
function fetch_meta(){    
    if(meta_iter<videofiles.length){
        meta_vid.setAttribute('src',URL.createObjectURL(videofiles[meta_iter]))
    }else {
        meta_vid.setAttribute('src',URL.revokeObjectURL(videofiles[meta_iter]))
        meta_vid.removeAttribute('src')
    }
}
//fn to change the shuffle bool
function shuffleFn(){
    let shuff_disp = shuffle.previousElementSibling.classList;
    random=!random
    random?shuff_disp.replace('fa-exchange-alt','fa-random'):shuff_disp.replace('fa-random','fa-exchange-alt')
}

//global functionality
// !!(localStorage.getItem('settings'))?JSON.parse(localStorage.getItem('settings')):localStorage.setItem('settings',JSON.stringify({random,autoplay,autoresume}))

//e loadmetadata
meta_vid.addEventListener('loadedmetadata', function(){
    li_list=qsa('#list li')
    geid(meta_iter).innerHTML+= `<div>${parseInt(this.duration/60,10)}:${Math.round(this.duration%60)}</div>`;
    meta_iter++;
    fetch_meta()
})

//CONTROL FUNCTIONALITY

//button functionality
play.onclick=()=>toggle()
back.onclick=()=>seek(-20)
forward.onclick=()=>seek(20)
video.ontimeupdate = _=>updatetime()
prev.onclick = ()=>nextvid('prev')
next.onclick = ()=>nextvid()
video.ondblclick = ()=>toggle()
video_cont.onclick=function(){
    ctr_vis.forEach(el=>el.style.animation = 'visibilityanim 5s linear')

    ctr_vis.forEach(el=>{el.addEventListener('animationend',_=>{
        el.style.animation = ''
    },{once:true})})
}

//button functions
function toggle(){
    if(video.paused){
      video.play();
    }else{
      video.pause()
    }
}
video.onpause=_=>{iTag[0].classList.replace('fa-play','fa-pause');iTag[1].classList.replace('fa-pause','fa-play');showtemp(iTag,1.2)};
video.onplay=_=>{iTag[0].classList.replace('fa-pause','fa-play');iTag[1].classList.replace('fa-play','fa-pause');showtemp(iTag,1.2)};
function seek(time){
    video.currentTime+=time
}

function updatetime(){
    let curr_tim = `${parseInt(video.currentTime/60,10)}:${Math.round(video.currentTime%60)}`
    let juicPos = video.currentTime/video.duration;
    fill.style.left = `${juicPos*100}%`;
    curr_time.innerText = curr_tim
}

backbar.addEventListener('mouseup',function(e){
    let pos = (e.offsetX/backwidth)
    video.currentTime = Math.round(pos*video.duration)
},false)
//swipe functionality
let initialX = null;
let initialY = null;
video_cont.addEventListener('touchstart',function(e){
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
},false)

video_cont.addEventListener('touchmove',function(e){
    e.preventDefault();
    if (initialX === null||initialY === null) {
        return;
    }
    
    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;
    
    let diffX = initialX - currentX;
    let diffY = initialY - currentY;
    (Math.abs(diffX) > Math.abs(diffY))?((diffX > 0)?video.currentTime-=10:video.currentTime+=20):volAdj(diffY)
    initialX = null
    initialY = null
},false)
video_cont.addEventListener('touchend',function(e){
},false)


// shortcodes
function qs(el){return document.querySelector(el)}
function qsa(el){return document.querySelectorAll(el)}
function geid(el){return document.getElementById(el)}
function log(){return console.log([...arguments])}

  window.addEventListener('keydown',function(event){
    event.preventDefault()
    if(video.getAttribute('src'))
    switch (event.code) {
        case 'ArrowLeft':
            modifyEvent(event,false)
            break;
        case 'ArrowRight':
            modifyEvent(event,true)
            break;
        case 'ArrowUp':
            volAdj(1)
            break;         
        case 'ArrowDown':
            volAdj(-1)
            break;         
        case 'KeyS':
            shuffle.click()
            break;         
        case 'KeyA':
            autoplay_el.click()
            break;         
        case 'KeyA':
            autoplay_el.click()
            break;         
        case 'Space':
            play.click()
            break;         
        case 'KeyN':
            nextvid()
            break;         
        case 'KeyP':
            nextvid('prev')
            break;         
        case 'KeyF':
            fullbtn.click()
            break;         
        default:false
            break;
    }
})
function volAdj(num){
    if(num>0){
        if(video.volume!==1.0)video.volume=(video.volume += 0.1).toPrecision(2)
    }else{
        if(!video.volume<=0.0)video.volume=(video.volume -= 0.1).toPrecision(2)
    }
    vol_disp.innerText=video.volume*100+'%'
    showtemp(vol_disp,1.5)
}
function modifyEvent({ctrlKey},arrow){
    video.currentTime = ctrlKey?(arrow?video.currentTime+10:video.currentTime-10):(arrow?video.currentTime+1:video.currentTime-1)
}
video_cont.onwheel=(e)=>volAdj(Math.sign(e.wheelDeltaY))