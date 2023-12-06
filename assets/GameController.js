var randomWords = require('random-words');
const numberOfWords = 40; 
const randomWordArray = Array.from({ length: numberOfWords }, () => randomWords());
const mapWords = {};
cc.Class({
    extends: cc.Component,
    
    properties: {
        registerPopup: cc.Node,
        userNameInput: cc.EditBox,
        avatarPopup: cc.Node,

        mainGame: cc.Node,
        textDemo: cc.RichText,
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
        
        // this.restartBtn.node.on('click', this.onRestartBtnClick, this);
        this.userMessageInput.node.on('text-changed', this.onTextChanged, this);
        this.circleNode.type = 3;
        this.circleNode.fillType = 2;
        this.circleNode.fillCenter.x = 0.5;
        this.circleNode.fillCenter.y = 0.5;
        this.circleNode.fillStart = 0.25;
        this.circleNode.fillRange = 1;
        window.gameController = this;
        
    }, 

    onTextChanged() {
        this.onCountDown = true;
        const inputText = this.userMessageInput.string;

        if (inputText.endsWith(' ')) {
            this.userMessageInput.string = '';
            this.userMessageInput.textLabel.string = '';
            this.userMessageInput.focus();
            this.mapWords[this.countWord] = inputText.trim();
            this.countWord++;
            this.updateDemoText();
        }

    },

    updateDemoText() {
        let richText = "";
        for (let index = 0; index < randomWordArray.length; index++) {
            const text = randomWordArray[index];
            const userText = this.mapWords[index];
            let string = "";
            if (!userText) {
                string = `<color=#160303>${text}</c> `
            } else if (text === userText) {
                string = `<color=#33FF00>${text}</c> `
            } else {
                string = `<color=#FF0000>${text}</c> `
            }
            richText += string;
        }
        this.textDemo.getComponent(cc.RichText).string = richText;  
        
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
        this.countWord = 0;
        this.mapWords = {};
        this.registerPopup.active = false;
        this.mainGame.active = true;
        this.winPopup.active = false;
        this.displayUserInfo();
    },
        
    displayUserInfo() {
        const avatarOption = this.userInfo.avatarOption;
        const userName = this.userInfo.userName;
        this.userAvatar.getComponent(cc.Sprite).spriteFrame = this.listAvatar[avatarOption - 1];
        this.userName.getComponent(cc.Label).string = `${userName}`;
        // this.textDemo.getComponent(cc.Label).string = randomWordArray.join(" ");
        this.updateDemoText();
    },

    displayScore (correctWords){
        this.score.getComponent(cc.Label).string = `Your Accuracy: ${(correctWords / numberOfWords).toFixed(2) * 100}%`;
        this.correctWord.getComponent(cc.Label).string = `Corrected Words: ${correctWords}`;
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
        this.displayScore(correctWords);
    },

    countCorrectWords() {
        const typedWords = this.mapWords;
        const demoWords = randomWordArray;
        let correctCount = 0;
    
        for (let index in typedWords) {
            if (typedWords.hasOwnProperty(index) && demoWords[index] === typedWords[index]) {
                correctCount++;
            }
        }
    
        return correctCount;
    },
}); 