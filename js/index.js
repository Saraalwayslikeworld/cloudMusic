let indexPage = {
    init(){
        this.getLatestMuisc()
    },
    getLatestMuisc(){     
        $.get('../static/songs.json').then((list)=>{
            console.log(list)
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
    }
    
}
indexPage.init()
