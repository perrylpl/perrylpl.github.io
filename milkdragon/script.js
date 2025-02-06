// 准备一些有趣的奶龙消息
const messages = [
    "奶龙 我饿了！",
    "奶龙今天想吃冰淇淋！",
    "奶龙要去睡午觉啦～",
    "奶龙想要抱抱！",
    "奶龙觉得你最棒啦！"
];

// 当点击标题时，随机显示一条消息
document.querySelector('h1').onclick = function() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    alert(messages[randomIndex]);
} 