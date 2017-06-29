var gameState = {
    preload: function () {
    },
    create: function () {
        game.add.sprite(0, 0, 'background');
        var map = game.cache.getJSON('levels')[game.global.level];
        var width = map[0].length;
        var height = map.length;
        var margin_left = (game.world.width - game["const"].BSIZE * width) / 2;
        var margin_top = (game.world.height - game["const"].BSIZE * height) / 2;
        var level_text = game.add.text(10, 10, "Level: " + (game.global.level + 1) + "/" + game.cache.getJSON('levels').length, { font: '12px monospace', fill: '#ffffff' });
        this.target = 0;
        this.target_text = game.add.text(level_text.width + 30, 10, 'Target: 0', { font: '12px monospace', fill: '#ffffff' });
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.traps = game.add.group();
        this.traps.enableBody = true;
        this.player = game.add.sprite(0, 0, 'player');
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 1000;
        this.player.alive = true;
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.lavas = game.add.group();
        this.lavas.enableBody = true;
        this.coins = game.add.group();
        this.coins.enableBody = true;
        for (var r = 0; r < height; r++)
            for (var c = 0; c < width; c++) {
                var x = c * game["const"].BSIZE + margin_left;
                var y = r * game["const"].BSIZE + margin_top;
                switch (map[r][c]) {
                    case 'X':
                        var wall = this.walls.create(x, y, 'wall');
                        wall.body.immovable = true;
                        break;
                    case 'P':
                        this.player.x = x;
                        this.player.y = y;
                        break;
                    case 'L':
                        var lava = this.lavas.create(x, y, 'lava');
                        lava.animations.add('wave', [0, 1, 2, 3], 2, true);
                        lava.animations.play('wave');
                        lava.body.immovable = true;
                        break;
                    case 'C':
                        var coin = this.coins.create(x, y, 'coin');
                        coin.alive = true;
                        coin.anchor.setTo(.5);
                        coin.x += game["const"].BSIZE / 2;
                        coin.y += game["const"].BSIZE / 2;
                        coin.animations.add('blink', [0, 1, 2, 3, 2, 1], 12, true);
                        coin.animations.play('blink');
                        coin.body.immovable = true;
                        this.target++;
                        break;
                    case 'T':
                        var trap = this.traps.create(x, y, 'trap');
                        trap.body.immovable = true;
                        break;
                }
            }
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.pressSpace, this);
        this.gameover_text = game.add.text(0, Math.floor(game.world.height / 2) - 20, 'Gameover!', { font: '32px monospace', fill: '#ffffff' });
        this.gameover_text.x = Math.floor((game.world.width - this.gameover_text.width) / 2);
        this.gameover_text.visible = false;
        this.gameover_subtext = game.add.text(0, Math.floor(game.world.height / 2) + 10, 'Press spacebar to replay!', { font: '16px monospace', fill: '#ffffff' });
        this.gameover_subtext.x = Math.floor((game.world.width - this.gameover_subtext.width) / 2);
        this.gameover_subtext.visible = false;
        this.win_text = game.add.text(0, Math.floor((game.world.height - 32) / 2), 'You win!', { font: '32px monospace', fill: '#ffffff' });
        this.win_text.x = Math.floor((game.world.width - this.win_text.width) / 2);
        this.win_text.visible = false;
        this.pause_text = game.add.text(0, Math.floor((game.world.height - 32) / 2), 'Paused!', { font: '32px monospace', fill: '#ffffff' });
        this.pause_text.x = Math.floor((game.world.width - this.pause_text.width) / 2);
        this.pause_text.visible = false;
        this.target_text.text = 'Target: ' + this.target;
        this.pause = false;
    },
    update: function () {
        var hit_platform = game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.player, this.traps, this.gameover, null, this);
        game.physics.arcade.overlap(this.player, this.lavas, this.gameover, null, this);
        game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
        if (!this.player.alive || this.pause)
            return;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
        }
        else {
            this.player.body.velocity.x = 0;
        }
        if (this.cursors.up.isDown && hit_platform && this.player.body.touching.down) {
            this.player.body.velocity.y = -350;
        }
    },
    gameover: function () {
        if (this.target !== 0) {
            this.gameover_text.visible = true;
            this.gameover_subtext.visible = true;
            this.player.alive = false;
        }
    },
    pressSpace: function () {
        if (this.player.alive === false || this.target === 0) {
            game.global.level = 0;
            game.state.start('game');
            return;
        }
        this.pauseGame();
    },
    pauseGame: function () {
        var _this = this;
        this.pause = !this.pause;
        game.physics.arcade.isPaused = this.pause;
        this.pause_text.visible = this.pause;
        setTimeout(function () { return game.lockRender = _this.pause; }, 100);
    },
    collectCoin: function (player, coin) {
        var _this = this;
        if (!this.player.alive)
            return;
        var coin_tween = game.add.tween(coin.scale);
        coin_tween.to({ x: 0, y: 0 }, 100, Phaser.Easing.Linear.None);
        coin_tween.onComplete.addOnce(function () {
            coin.kill();
            if (_this.target === 0) {
                _this.target = -1;
                if (game.cache.getJSON('levels')[game.global.level + 1]) {
                    game.global.level++;
                    game.state.start('game');
                }
                else {
                    _this.win_text.visible = true;
                }
            }
        });
        coin_tween.start();
        if (coin.alive) {
            this.target--;
            this.target_text.text = 'Target: ' + this.target;
            coin.alive = false;
        }
    }
};
