var randomWords = require('random-words');
const numberOfWords = 50; 
const randomWordArray = Array.from({ length: numberOfWords }, () => randomWords());

cc.Class({
    extends: cc.Component,
    
    properties: {
        registerPopup: cc.Node,
        userNameInput: cc.EditBox,
        avatarPopup: cc.Node,

        mainGame: cc.Node,
        textDemo: cc.Label,
        userMessageInput: cc.EditBox,
        userAvatar: cc.Sprite,
        userName: cc.Label,
        circleNode: cc.Sprite,
        timeLabel: cc.Label,
        time: 60,
        count: 3600,
        onCountDown: false,

        listAvatar: [cc.SpriteFrame],

        winPopup: cc.Node,
        score: cc.Label,
        correctWord: cc.Label,

    },

    onLoad () {
        this.registerPopup.active = true;
        this.mainGame.active = false;
        this.winPopup.active = false;
        this.avatarPopup.children[0].color = cc.Color.WHITE;
        

        this.userMessageInput.node.on('text-changed', this.onTextChanged, this);
        this.circleNode.type = 3;
        this.circleNode.fillType = 2;
        this.circleNode.fillCenter.x = 0.5;
        this.circleNode.fillCenter.y = 0.5;
        this.circleNode.fillStart = 0.25;
        this.circleNode.fillRange = 1;
    }, 

    onTextChanged() {
        this.onCountDown = true;
        // const inputText = this.userMessageInput.string;
        // //  cc.log(this.userMessageInput.string)
        // //  cc.log(inputText)

        // if (inputText.endsWith(' ')) {
        //     this.userMessageInput.string = '';
        // }

    },

    onSelectAvatar(event, avatarOption) {
        this.avatarPopup.children.forEach((avatar, index) => {
            avatar.color = index + 1 === Number(avatarOption) ? cc.Color.WHITE : cc.Color.GRAY;
        });
        this.avatarOption = avatarOption;
    },

    onEnterGame() {
        if (!this.userNameInput.string) {
            return window.alert("Please enter your user name!!");
        }
        if (this.userNameInput.string.length < 4) {
            return window.alert("Your user name is less than 4 characters");
        }
        this.userInfo = {
                            avatarOption: this.avatarOption,
                            userName: this.userNameInput.string
                        }
        this.startGame();
    },

    startGame() {
        this.registerPopup.active = false;
        this.mainGame.active = true;
        this.winPopup.active = false;
        this.displayUserInfo();
        this.calculateScore();

    },
        
    displayUserInfo() {
        const avatarOption = this.userInfo.avatarOption;
        const userName = this.userInfo.userName;
        this.userAvatar.getComponent(cc.Sprite).spriteFrame = this.listAvatar[avatarOption - 1];
        this.userName.getComponent(cc.Label).string = `${userName}`;
        this.textDemo.getComponent(cc.Label).string = randomWordArray.join(" ");
    },

    displayScore (score,correctWords){
        this.score.getComponent(cc.Label).string = `Your Accuracy: ${score.toFixed(2)}%`;
        this.correctWord.getComponent(cc.Label).string = `Corrected Words (WPM): ${correctWords}`;
    },

    update(dt) {
        if (this.time >= 0 && this.onCountDown ) {
            this.circleNode.fillRange -= dt / 60;
            if (this.count % 60 === 0) {
                this.timeLabel.string = this.time;
                this.time--;
            }
            if (this.count < 3600) this.circleNode.node.color = cc.Color.GREEN;
            if (this.count <= 3600 * 0.3) this.circleNode.node.color = cc.Color.YELLOW;
            if (this.count <= 3600 * 0.1) this.circleNode.node.color = cc.Color.RED;
            this.count--;
        }
        if(this.time < 0) {
            this.runWinPopup();
        }
    },

    runWinPopup(){
        this.registerPopup.active = false;
        this.mainGame.active = false;
        this.winPopup.active = true;
        
        const correctWords = this.countCorrectWords();
        const totalWords = randomWordArray.length;
        const percentage = (correctWords / totalWords) * 100;

        const score = this.calculateScore(correctWords);
        this.displayScore(percentage,correctWords);
    },

    calculateScore() {
        const correctWords = this.countCorrectWords();
        const totalWords = randomWordArray.length;
        const percentage = (correctWords / totalWords) * 100;
    },

    countCorrectWords() {
        const typedWords = this.userMessageInput.string.trim().split(/\s+/);        
        const demoWords = this.textDemo.string.trim().split(/\s+/);
        let correctCount = 0;

        for (let i = 0; i < typedWords.length; i++) {
            if (typedWords[i] === demoWords[i]) {
                correctCount++;
            }
        }
        return correctCount;
    },
}); 