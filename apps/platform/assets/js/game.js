var gameState = {
    preload: function () {
    },
    createInfo: function () {
        var basic_style = { font: '12px monospace', fill: '#ffffff' };
        var large_style = { font: '32px monospace', fill: '#ffffff' };
        var target = 0;
        var level_text = game.add.text(10, 10, "Level: " + (game.global.level + 1) + "/" + game.cache.getJSON('levels').length, basic_style);
        level_text.fixedToCamera = true;
        var target_text = game.add.text(level_text.width + 20, 10, 'Target: 0', basic_style);
        target_text.fixedToCamera = true;
        var message_text = game.add.text(Math.floor(game.camera.width / 2), Math.floor((game.camera.height - 32) / 2), '', large_style);
        message_text.anchor.x = .5;
        message_text.fixedToCamera = true;
        var tip_text = game.add.text(0, game.camera.height - 22, 'LEFT|RIGHT ARROW: Move   &   UP ARROW: Jump   &   SPACEBAR: play/pause   &   ESC: Menu   &   R: Replay', basic_style);
        tip_text.x = Math.floor((game.camera.width - tip_text.width) / 2);
        tip_text.fixedToCamera = true;
        var info = {};
        Object.defineProperty(info, 'target', {
            get: function () {
                return target;
            },
            set: function (ntarget) {
                target = ntarget;
                target_text.text = 'Target: ' + target;
            }
        });
        Object.defineProperty(info, 'message', {
            get: function () {
                return message_text.text;
            },
            set: function (nmessage) {
                message_text.text = nmessage;
            }
        });
        this.info = info;
    },
    create: function () {
        var _this = this;
        // setup
        localStorage.setItem('platform-last-level', game.global.level);
        // world
        game.world.setBounds(0, 0, 2000, 2000);
        game.add.sprite(0, 0, 'background').fixedToCamera = true;
        // map
        var map = game.cache.getJSON('levels')[game.global.level];
        var width = map[0].length;
        var height = map.length;
        var margin_left = (game.world.width - 20 * width) / 2;
        var margin_top = (game.world.height - 20 * height) / 2;
        // physic
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // object
        this.traps = game.add.group();
        this.traps.enableBody = true;
        this.player = game.add.sprite(0, 0, 'player');
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 1000;
        this.player.alive = true;
        game.camera.follow(this.player);
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.lavas = game.add.group();
        this.lavas.enableBody = true;
        this.coins = game.add.group();
        this.coins.enableBody = true;
        this.createInfo();
        for (var r = 0; r < height; r++)
            for (var c = 0; c < width; c++) {
                var x = c * 20 + margin_left;
                var y = r * 20 + margin_top;
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
                        var lava = this.lavas.create(x, y + 2, 'lava');
                        lava.animations.add('wave', [0, 1, 2, 3], 2, true);
                        lava.animations.play('wave');
                        lava.body.immovable = true;
                        break;
                    case 'C':
                        var coin = this.coins.create(x, y, 'coin');
                        coin.alive = true;
                        coin.anchor.setTo(.5);
                        coin.x += 20 / 2;
                        coin.y += 20 / 2;
                        coin.animations.add('blink', [0, 1, 2, 3, 2, 1], 12, true);
                        coin.animations.play('blink');
                        coin.body.immovable = true;
                        this.info.target++;
                        break;
                    case 'T':
                        var trap = this.traps.create(x, y, 'trap');
                        trap.body.immovable = true;
                        break;
                }
            }
        // keyboard
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.pressSpace, this);
        game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(function () { return game.state.start('game'); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function () { return game.state.start('menu'); }, this);
        // mode
        this.mode = 'preplay';
        this.info.message = "Level: " + (game.global.level + 1);
        setTimeout(function () {
            _this.info.message = '';
            _this.mode = 'play';
        }, 1000);
    },
    update: function () {
        var hit_platform = game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.player, this.traps, this.gameover, null, this);
        game.physics.arcade.overlap(this.player, this.lavas, this.gameover, null, this);
        game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
        if (this.mode !== 'play' && this.mode !== 'preplay')
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
        if (this.mode !== 'gameover' && this.mode !== 'finish') {
            this.mode = 'gameover';
            this.info.message = 'Gameover';
        }
    },
    pressSpace: function () {
        if (this.mode !== 'pause' && this.mode !== 'play')
            return;
        if (this.mode === 'pause') {
            this.mode = 'play';
            this.info.message = '';
            game.physics.arcade.isPaused = false;
            return;
        }
        this.mode = 'pause';
        this.info.message = 'Pause';
        game.physics.arcade.isPaused = true;
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
            if (_this.info.target === 0 && _this.mode !== 'finish') {
                _this.mode = 'finish';
                game.global.level++;
                if (game.cache.getJSON('levels')[game.global.level]) {
                    _this.info.message = 'Complete';
                    setTimeout(function () { return game.state.start('game'); }, 1000);
                }
                else {
                    _this.info.message = 'Win';
                }
            }
        });
        coin_tween.start();
        if (coin.alive) {
            this.info.target--;
            coin.alive = false;
        }
    }
};
