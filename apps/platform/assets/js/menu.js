var menuState = {
    preload: function () {
    },
    create: function () {
        game.add.sprite(0, 0, 'intro');
        game.add.sprite(100, 60, 'help');
        game.add.button(game.camera.width - 180, game.camera.height - 140, 'button', this.newGame, this);
        game.add.text(game.camera.width - 105, game.camera.height - 118, 'New game', { font: '20px monospace', fill: '#ffffff' }).anchor.setTo(.5);
        game.add.button(game.camera.width - 200, game.camera.height - 80, 'button', this["continue"], this);
        game.add.text(game.camera.width - 125, game.camera.height - 58, 'Continue', { font: '20px monospace', fill: '#ffffff' }).anchor.setTo(.5);
    },
    newGame: function () {
        game.global.level = 0;
        game.state.start('game');
    },
    "continue": function () {
        game.global.level = parseInt(localStorage.getItem('platform-last-level') || '0');
        game.state.start('game');
    }
};
