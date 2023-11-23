import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const imagesArray = ["images/gryffindor.png",
                    "images/slytherin.png",
                    "images/hufflepuff.png",
                    "images/ravenclaw.png",]

function getRandomProfilePic() {
    const randomNumber = Math.floor(Math.random() * imagesArray.length)

    let randomProfilePic = imagesArray[randomNumber]

    return randomProfilePic
}

console.log(getRandomProfilePic())

let tweetsFromLocalStorage = JSON.parse( localStorage.getItem("myTweets") )

if (tweetsFromLocalStorage) {
    render()
} else {
    localStorage.setItem( "myTweets", JSON.stringify(tweetsData) )
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.answer) {
        handleReplyBtnClick(e.target.dataset.answer)
    }
    else if (e.target.dataset.delete) {
        deleteTweet(e.target.dataset.delete)
    }
}
)
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsFromLocalStorage.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    // Save likes to localStorage
    localStorage.setItem( "myTweets", JSON.stringify(tweetsFromLocalStorage) )

    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsFromLocalStorage.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    // Save retweets (number of retweets) to localStorage
    localStorage.setItem( "myTweets", JSON.stringify(tweetsFromLocalStorage) )

    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

        // Save new tweets to localStorage

        if (tweetsFromLocalStorage) {
            
            if(tweetInput.value.trim()){
                    tweetsFromLocalStorage.unshift({
                        handle: `@Hogwarts student`,
                        profilePic: getRandomProfilePic(),
                        likes: 0,
                        retweets: 0,
                        tweetText: tweetInput.value,
                        replies: [],
                        isLiked: false,
                        isRetweeted: false,
                        uuid: uuidv4()
                    })
                    localStorage.setItem( "myTweets", JSON.stringify(tweetsFromLocalStorage))
                    render()
            }
        } else {
            if(tweetInput.value.trim()){
                tweetsData.unshift({
                    handle: `@Hogwarts student`,
                    profilePic: getRandomProfilePic(),
                    likes: 0,
                    retweets: 0,
                    tweetText: tweetInput.value,
                    replies: [],
                    isLiked: false,
                    isRetweeted: false,
                    uuid: uuidv4()
                })
            localStorage.setItem( "myTweets", JSON.stringify(tweetsData) )
            tweetsFromLocalStorage = JSON.parse( localStorage.getItem("myTweets") )
            render()
        }
    }
    tweetInput.value = ''
}

function handleReplyBtnClick(tweetId) {

    const replyInput = document.getElementById(`reply-input-${tweetId}`)

        if (replyInput.value.trim()) {
            console.log(tweetId)
    
                const targetTweetObj = tweetsFromLocalStorage.filter(function(tweet){
                    return tweet.uuid === tweetId
                })[0]
        
                targetTweetObj.replies.push(
                    {
                        handle: `@Scrimba`,
                        profilePic: `images/scrimbalogo.png`,
                        tweetText: replyInput.value,
                    },
                )
    
                localStorage.setItem( "myTweets", JSON.stringify(tweetsFromLocalStorage) )
                
                render()
    
        replyInput.value = ""
    }

}

function deleteTweet(tweetId) {

    tweetsFromLocalStorage = tweetsFromLocalStorage.filter( function(tweet) {
        return tweet.uuid !== tweetId
    })
                
    render()
}

function getFeedHtml(){
    let feedHtml = ``

    tweetsFromLocalStorage.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div class="tweet-post">
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>  
        <button class="delete-btn" data-delete="${tweet.uuid}">🗑</button>          
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class="reply-input-area">
			<img src="images/scrimbalogo.png" class="profile-pic">
			<textarea placeholder="What's happening?" id="reply-input-${tweet.uuid}"></textarea>
		</div>
		<button data-answer="${tweet.uuid}">Reply</button>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
