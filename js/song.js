let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)  
//直接match得到的id是字符串，需要解析成数字类型

let songPage = {
    init(){  
       this.getMusicData()
    },
    getMusicData(){
        $.get('/static/songs.json').then( list=>{
            let song = list.filter(item=>{
                return item.id === id
            })[0]
            let {title,singer,img,url,lrc} = song
            console.log(song)
            this.pageInit(title,singer,img,lrc)
            this.playerInit(url)
        })
    },
    pageInit(title,singer,img,lrc){
        $('.info .title').text(`${title}-${singer}`)
        $('.disc .cover').attr("src",img)
        $('.bg').css({
            "background" :` url(${img}) no-repeat center`,
            "background-size": "cover"
        })
        this.parseLyric(lrc)
    },
    parseLyric(lrc) { 
            let arr = lrc.split('\n')
            let reg = /^\[(.+)\](.*)$/
            arr = arr.map(string =>{
                let matches = string.match(reg)
                if(matches){
                    if(matches[1].search(/\]\[/)>-1){
                        matches[1] = matches[1].split('][')
                    } 
                    return{time:matches[1],lrc:matches[2]}
                }
            })
            arr.forEach(word=>{
                if(word){            
                    $p=$('<p></p>')
                    $p.attr('date-time',word.time)
                    $p.text(word.lrc)
                    $('.lines').append($p)
                }
            })
    },
    playerInit(url){
        let audio = document.createElement('audio')
        audio.src = url
        audio.oncanplay = ()=>{ 
            $('.disc').addClass('playing')
            audio.play()
        }
        audio.onended = ()=>{
            $('.disc').removeClass('playing')
        }
        $('.play-btn').on('click',function(){
            if($('.disc').hasClass('playing')){
                $('.disc').removeClass('playing')
                audio.pause()
            }else{
                $('.disc').addClass('playing')
                audio.play()
            }
        })
        setInterval(()=>{
            let curtime = audio.currentTime
            let min = ~~(curtime/60)
            let sec = curtime - 60*min
            min = min>10?min:'0'+min
            sec = sec>10?sec:'0'+sec
            let time = `${min}:${sec}`
            let $line = $('.lines>p')
            let curline
            for(let i=0;i<$line.length;i++){
                let curlineTime = $line.eq(i).attr('date-time')
                let nextlineTime = $line.eq(i+1).attr('date-time')
                if($line.eq(i+1).length!==0 &&curlineTime<time&&nextlineTime>time){
                    curline = $line.eq(i)
                    break
                }
            }
            if(curline){
                let top = curline.offset().top
                let linesTop = $('.lines').offset().top
                let delta = top - linesTop - $('.lyric').height()/3
                curline.addClass('active')
                        .siblings().removeClass('active')
                $('.lines').css('transform',`translateY(-${delta}px)`)
            }
        },500)
    },   
}
songPage.init()