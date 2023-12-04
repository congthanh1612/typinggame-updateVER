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
        listAvatar: [cc.SpriteFrame],
    },

    onLoad () {
        this.registerPopup.active = true;
        this.avatarPopup.children[0].color = cc.Color.BLUE;
        this.mainGame.active = false;
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this); 
        // debug purpose: test main game
        // this.mainGame.active = true;
        // this.registerPopup.active = false;
        // this.onEnterGame()
    }, 

    onSelectAvatar(event, avatarOption) {
        this.avatarPopup.children.forEach((avatar, index) => {
            avatar.color = index + 1 === Number(avatarOption) ? cc.Color.BLUE : cc.Color.WHITE;
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
        this.displayUserInfo();
        setTimeout(() => {
            if (this.textDemo.string === this.userMessageInput.string) {
                window.alert("You Win 100 score");
            } else {
                window.alert("You are near win");
            }
        }, 15000);
    },

    // onKeyUp(event) {
    //     switch(event.keyCode) {
    //         case cc.macro.KEY.space:
    //             console.log('space');
    //             break;
    //     }
    // },

    // onDestroy() {
    //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    // },

    displayUserInfo() {
        const avatarOption = this.userInfo.avatarOption;
        const userName = this.userInfo.userName;
        this.userAvatar.getComponent(cc.Sprite).spriteFrame = this.listAvatar[avatarOption - 1];
        this.userName.getComponent(cc.Label).string = `User Name: ${userName}`;
    }
});
