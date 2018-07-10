let indexPage = {
    init(){
        this.getLatestMuisc()
        this.tabControl()
        this.hotSearch()
    },
    getLatestMuisc(){     
        $.get('static/songs.json').then((data)=>{
            console.log('get')
            this.render(data.list,$('.latestMusic>ol'))
        })
        $('.latestMusic>.loading').remove()
    },
    render(list,$node){
        list = list.sort((a,b)=>{return a.rank>b.rank})
        list.forEach(item=>{
            let $li = `
                <li>
                <div class="rank">${item.rank>=10?item.rank:'0'+item.rank}</div>
                <a href="./song.html?id=${item.id}">
                    <div class="info">
                        <h3>${item.title}</h3>
                        <p>
                            <svg class="icon"><use xlink:href="#icon-sq"></use> </svg>
                            ${item.singer}-${item.album}
                        </p>
                        <svg class="icon">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                    </div>
                </a>
            </li>`
            if(item.isSQ){
                $li = `            
                <li>
                    <div class="rank">${item.rank>=10?item.rank:'0'+item.rank}</div>
                    <a href="./song.html?id=${item.id}">
                        <div class="info">
                            <h3>${item.title}</h3>
                            <p>
                                ${item.singer}-${item.album}
                            </p>
                            <svg class="icon">
                                <use xlink:href="#icon-play"></use>
                            </svg>
                        </div>
                    </a>
                </li>`
            }
            $node.append($li)
        })
    },
    tabControl(){
        $('.siteNav li').on('click',(e)=>{
            let $li = $(e.currentTarget)
            $li.addClass('active').siblings().removeClass('active')
            let index = $li.index()
            $('.tabContent>li').eq(index).addClass('active').siblings().removeClass('active')
            $li.trigger('tabChange',index)
        })
        $('.siteNav').on('tabChange',(e,index)=>{
            if(index===1&&$('.tabContent>li').eq(1).attr("isLoaded")!=="yes"){
                $.get('static/hotList.json').then((res)=>{
                    $('#hotList .loading').remove()
                    $('.tabContent>li').eq(index).attr("isLoaded","yes")
                    $('.update').text(res.updateTime)
                    this.render(res.data,$('#hotList .list'))
                    for(let i =0;i<3;i++){$('#hotList .list').find('li>.rank').eq(i).css("color","#df3436")}
                })
                
            }else if(index===2&&$('.tabContent>li').eq(2).attr("isLoaded")!=="yes"){
                $.get('static/hotSearch.json').then((res)=>{
                    $('.tabContent>li').eq(index).attr("isLoaded","yes")
                    res.hotKeyWord.forEach((kw)=>{
                        $('.hotWords .words').append(`<li><a href="#">${kw}</a></li>`)
                    })
                    
                })
            }
        })
    },
    hotSearch(){
        let timer = undefined
        $('input.search').on('input',(e)=>{
            $('#search').addClass('searching')
            let keyword = $(e.currentTarget).val().trim()
            if($(e.currentTarget).val()==''){return}
            if(timer){
                clearTimeout(timer)
            }
            timer = setTimeout(()=>{
                $('.results li').remove()
                this.search(keyword).then((result)=>{
                    timer = undefined
                    if(result.length!==0){
                        $('.results .keyword').text(`搜索“${keyword}”`)
                            this.render(result,$('.results>ol'))
                    }else{
                        $('.results .keyword').text(`搜索“${keyword}”没有结果`)
                    }
                })
            },1000)
        })
        $('.inputbox>.icon-close').on('click',()=>{
            $('#search').removeClass('searching')
            $('input').val('')
        })
    },
    search(keyword){
        return new Promise((resolve,reject)=>{
            let dictionary = [
                { "id": 1, "isSQ": true, "title": "白兰鸽巡游记", "singer": "丢火车乐队", "album": "游歌" },
                { "id": 2, "isSQ": true, "title": "SoulMate", "singer": "JustinTimberlake", "album": "SoulMate" },
                { "id": 3, "isSQ": false, "title": "哭砂", "singer": "张惠妹", "album": "A-meiAcousticBest" },
                { "id": 4, "isSQ": false, "title": "匆匆那年", "singer": "王菲", "album": "匆匆那年" },
                { "id": 5, "isSQ": true, "title": "Yellow", "singer": "Coldplay", "album": "Yellow" } 
            ]
                let result = dictionary.filter((item)=>{
                    return item.title.search(keyword)>=0
                })
                setTimeout(()=>{
                    resolve(result)
                },Math.random()*500+100)
        })
    },
    
}
indexPage.init()
