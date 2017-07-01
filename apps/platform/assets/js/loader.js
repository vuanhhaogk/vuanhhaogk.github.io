var loaderState = {
    preload: function () {
        game.add.sprite(0, 0, 'background');
        game.add.sprite((game.camera.width - 300) / 2, (game.camera.height - 20) / 2, 'loader_bg');
        var cur = game.add.sprite((game.camera.width - 300) / 2, (game.camera.height - 20) / 2, 'loader_cur');
        game.load.setPreloadSprite(cur);
        game.load.image('player', 'assets/images/player.png');
        game.load.image('trap', 'assets/images/trap.png');
        game.load.image('door', 'assets/images/door.png');
        game.load.image('wall', 'assets/images/wall.png');
        game.load.image('intro', 'assets/images/intro.png');
        game.load.image('button', 'assets/images/button.png');
        game.load.image('help', 'assets/images/help.png');
        game.load.spritesheet('coin', 'assets/images/coin.png', 12, 12);
        game.load.spritesheet('lava', 'assets/images/lava.png', 20, 18);
        game.load.json('levels', 'assets/data/levels.json');
    },
    create: function () {
        game.state.start('menu');
    }
};
