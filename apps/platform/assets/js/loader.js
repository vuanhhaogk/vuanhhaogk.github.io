var loaderState = {
    updateLoadingTitle: function () {
        var text = '';
        this.loading_count_dot = this.loading_count_dot % 4 + 1;
        for (var i = 1; i < this.loading_count_dot; i++)
            text += '.';
        this.loading_title.text = 'Loading' + text;
    },
    preload: function () {
        game.add.sprite(0, 0, 'background');
        this.loading_count_dot = 3;
        this.loading_title = game.add.text(10, game.world.height - 22, 'Loading...', { font: '12px monospace', fill: '#ffffff' });
        this.time.events.loop(300, this.updateLoadingTitle, this);
        game.load.image('player', 'assets/images/player.png');
        game.load.image('trap', 'assets/images/trap.png');
        game.load.image('door', 'assets/images/door.png');
        game.load.image('wall', 'assets/images/wall.png');
        game.load.spritesheet('coin', 'assets/images/coin.png', 20, 20);
        game.load.spritesheet('lava', 'assets/images/lava.png', 20, 20);
        game.load.json('levels', 'assets/data/levels.json');
    },
    create: function () {
        game.state.start('game');
    }
};
