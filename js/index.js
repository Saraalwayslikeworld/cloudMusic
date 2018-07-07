let indexPage = {
    init(){
        this.getLatestMuisc()
        this.tabControl()
        this.hotSearch()
    },
    getLatestMuisc(){     
        $.get('../static/songs.json').then((list)=>{
            this.render(list)
        })
        $('.latestMusic>.loading').remove()
    },
    render(list){
        list.forEach(item=>{
            let $li = `
                <li>
                    <h3>${item.title}</h3>
                    <p>
                        ${item.singer}-${item.album}
                    </p>
                    <svg class="icon">
                        <use xlink:href="#icon-play"></use>
                    </svg>
                    <a href="./song.html?id=${item.id}"></a>
                </li>`
            if(item.isSQ){
                $li = `            
                    <li>
                        <h3>${item.title}</h3>
                        <p>
                            <svg class="icon">
                                <use xlink:href="#icon-sq"></use>
                            </svg>
                            ${item.singer}-${item.album}
                        </p>
                        <svg class="icon">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                        <a href="./song.html?id=${item.id}"></a>
                    </li>`
            }
            $('.latestMusic>ol').append($li)
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
                $.get('static/hotList.json').then((response)=>{
                    console.log(response)
                    $('.tabContent>li').eq(index).attr("isLoaded","yes")
                })
            }else if(index===2&&$('.tabContent>li').eq(2).attr("isLoaded")!=="yes"){
                $.get('static/hotSearch.json').then((response)=>{
                    console.log(response)
                    $('.tabContent>li').eq(index).attr("isLoaded","yes")
                })
            }
        })
    },
    hotSearch(){
        let timer = undefined
        $('input.search').on('input',(e)=>{
            let keyword = $(e.currentTarget).val().trim()
            if(timer){
                clearTimeout(timer)
            }
            timer = setTimeout(()=>{
                this.search(keyword).then((result)=>{
                    if(result.length!==0){
                        $('.results').text(result[0].title)
                    }else{
                        $('.results').text('没有搜索到结果')
                    }
                })
            },500)

        })
    },
    search(keyword){
        return new Promise((resolve,reject)=>{
            let dictionary = [
                { "id": 1, "isSQ": true, "title": "白兰鸽巡游记", "singer": "丢火车乐队", "album": "游歌" },
                { "id": 2, "isSQ": true, "title": "SoulMate", "singer": "Justin Timberlake", "album": "SoulMate" },
                { "id": 3, "isSQ": false, "title": "哭砂", "singer": "张惠妹", "album": "A-mei Acoustic Best" },
                { "id": 4, "isSQ": false, "title": "匆匆那年", "singer": "王菲", "album": "匆匆那年" },
                { "id": 5, "isSQ": true, "title": "Yellow", "singer": "Coldplay", "album": "Yellow" } 
            ]
            let result = dictionary.filter((item)=>{
                return item.title.search(keyword)>=0 || item.singer.search(keyword)>=0
            })
            setTimeout(()=>{
                resolve(result)
            },Math.random()*500+200)
        })
    }    
}
indexPage.init()
