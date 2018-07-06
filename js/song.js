var audio = new Audio()
var songPage = {
    init(){  
        audio.src = 'http://m10.music.126.net/20180629200754/2b768c65bf97f88d713550adf0d03d9e/ymusic/0ca4/1dd7/df4b/86e8bf58a5a367aad23e84bef976bba3.mp3'
        this.getlyric()
        audio.play()
        this.songplay()
    },
    getlyric() { 
        $.get('/static/songs.json').then( object=>{
            let {lyric} = object[0].lrc
            let arr = lyric.split('\n')
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
            this.render(arr)
        })
        
    },
    render(lyric){
        console.log(lyric)
        lyric.forEach(word=>{
            if(word.time){            
                $p=$('<p></p>')
                $p.attr('date-time',word.time)
                $p.text(word.lrc)
                $('.lines').append($p)
            }
        })
    },
    songplay(){
        $('.play-btn').on("click",function(){
            if($('.disc').hasClass('playing')){
                $('.disc').removeClass('playing')
                radio.pause()
            }else{
                $('.disc').addClass('playing')
                radio.play()
            }
        })
    }    
}
songPage.init()