let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)  
//真实场景下应根据列表id请求对应数据，这里mock的只有一个列表数据，id未起作用

let playlist = {
    init(){
        this.getData()
        this.showDescription()
    },
    getData(){
        $.get('./static/playlist.json').then(res=>{
            console.log(res)
            this.render(res)
        })
    },
    render(data){
        $('header .cover').css({
            "background":`url(${data.coverImgUrl}) no-repeat`,
            "background-size": "cover"
        })
        $('header .bg').css({
            "background":`url(${data.coverImgUrl}) no-repeat`,
            "background-size": "cover"
        })
        $('header .info>h3').text(data.name)
        $('header .user .avatar>img').attr("src",data.avatarUrl)
        $('header .user>span').text(data.nickname)
        data.tags.forEach(item=>{
            $('.intro .tags').append(`<span>${item}</span>`)
        })
        $('.intro .dsp>.content').append(`<span>${data.signature}</span><br>`)
                                 .append(`<span>${data.description}</span><br>`)
        data.tracks.forEach((item,index)=>{
            let $li = `
            <li>
                <div class="index">${index+1}</div>
                <a href="//music.163.com/m/song?id=${item.id}">
                    <div class="info">
                        <h3>${item.name}</h3>
                        <p>${item.ar.map(n=>{return n.name}).join('/')}-${item.al.name}</p>
                        <svg class="icon">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                    </div>
                </a>
            </li>
            `
            $('.playlist>ol').append($li)
        })
        if($('.content').height()<60){
            $('.intro .dsp>.icon').remove()
        }
    },
    showDescription(){
        $('.intro .content').on('click',()=>{
            $('.dsp').toggleClass('fold')
        })
    }
}
playlist.init()