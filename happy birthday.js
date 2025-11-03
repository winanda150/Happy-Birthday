// Website Happy Birthday

// Project 1

// Happy Birthday Animation with Fireworks and Balloons.
// Created By WinandaDev on 25 August 2025.
// For my sister Kirana, date of birth 18 November 2010.
// =====================================================

// --- Bagian utama pengaturan canvas dan parameter animasi ---
let c = document.getElementById("c");
let w = (c.width = window.innerWidth),
  h = (c.height = window.innerHeight),
  ctx = c.getContext("2d"),
  hw = w / 2;
(hh = h / 2),
  (opts = {
    // teks yang ditampilkan
    strings: ["HAPPY", "BIRTHDAY!", "KIRANA"],
    // ukuran karakter
    charSize: 30,
    // jarak antar karakter
    charSpacing: 35,
    // jarak antar baris
    lineHeight: 40,
    // titik tengah kanvas
    cx: w / 2,
    cy: h / 2,
    // --- Parameter kembang api ---
    fireworkPrevPoints: 10, // jumlah titik sebelumnya pada garis kembang api
    fireworkBaseLineWidth: 5, // ketebalan garis kembang api
    fireworkAddedLineWidth: 8,
    fireworkSpawnTime: 200, // waktu peluncuran kembang api
    fireworkBaseReachTime: 30, // waktu mencapai puncak kembang api
    fireworkAddedReachTime: 30,
    fireworkCircleBaseSize: 20, // ukuran lingkaran ledakan kembang api
    fireworkCircleAddedSize: 10,
    fireworkCircleBaseTime: 30, // waktu pembuatan lingkaran ledakan kembang api
    fireworkCircleAddedTime: 30,
    fireworkCircleFadeBaseTime: 10, // waktu memudar lingkaran ledakan kembang api
    fireworkCircleFadeAddedTime: 5,
    fireworkBaseShards: 5, // jumlah pecahan kembang api
    fireworkAddedShards: 5,
    fireworkShardPrevPoints: 3, // jumlah titik sebelumnya pada pecahan kembang api
    fireworkShardBaseVel: 4, // kecepatan pecahan kembang api
    fireworkShardAddedVel: 2,
    fireworkShardBaseSize: 3, // ukuran pecahan kembang api
    fireworkShardAddedSize: 3,
    // pengaruh gravitasi pada pecahan kembang api
    gravity: 0.1,
    // --- Parameter balon ---
    upFlow: -0.1, // aliran ke atas untuk balon
    letterContemplatingWaitTime: 380, // waktu menunggu karakter sebelum berubah menjadi balon
    balloonSpawnTime: 20, // waktu kemunculan balon
    balloonBaseInflateTime: 10, // waktu pengembangan balon
    balloonAddedInflateTime: 10,
    balloonBaseSize: 20, // ukuran balon
    balloonAddedSize: 20,
    balloonBaseVel: 0.3, // kecepatan balon terbang
    balloonAddedVel: 0.3,
    balloonBaseRadian: -(Math.PI / 2 - 0.5), // sudut radian balon
    balloonAddedRadian: -1,
  }),
  (calc = {
    totalWidth:
      opts.charSpacing *
      Math.max(opts.strings[0].length, opts.strings[1].length),
  }),
  (Tau = Math.PI * 2),
  (TauQuarter = Tau / 4),
  (letters = []);

ctx.font = opts.charSize + "px Poppins";

// --- Kelas Letter: mewakili satu karakter pada animasi ---
function Letter(char, x, y) {
  // Ambil shiftX dan shiftY dari global agar konsisten dengan posisi teks
  let shiftY = h * 0.05;
  let shiftX = w * 0.05;
  let fireworkOffsetY = 50; // offset spawn firework ke bawah

  this.char = char;
  this.x = x;
  this.y = y;

  this.dx = -ctx.measureText(char).width / 2;
  this.dy = +opts.charSize / 2;

  // Firework akan spawn dari posisi awal yang sudah digeser dengan shiftX dan shiftY
  this.fireworkStartX = 0 - shiftX;
  this.fireworkStartY = hh - shiftY + fireworkOffsetY;
  this.fireworkTargetX = x;
  this.fireworkTargetY = y;
  this.fireworkDx = this.fireworkTargetX - this.fireworkStartX;
  this.fireworkDy = this.fireworkTargetY - this.fireworkStartY;

  var hue = (x / calc.totalWidth) * 360;

  this.color = "hsl(hue,80%,50%)".replace("hue", hue);
  this.lightAlphaColor = "hsla(hue,80%,light%,alp)".replace("hue", hue);
  this.lightColor = "hsl(hue,80%,light%)".replace("hue", hue);
  this.alphaColor = "hsla(hue,80%,50%,alp)".replace("hue", hue);

  this.reset();
}
Letter.prototype.reset = function () {
  this.phase = "firework";
  this.tick = 0;
  this.spawned = false;
  this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
  this.reachTime =
    (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) |
    0;
  this.lineWidth =
    opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
  this.prevPoints = [[this.fireworkStartX, this.fireworkStartY, 0]];
};
Letter.prototype.step = function () {
  if (this.phase === "firework") {
    if (!this.spawned) {
      ++this.tick;
      if (this.tick >= this.spawningTime) {
        this.tick = 0;
        this.spawned = true;
      }
    } else {
      ++this.tick;
      var linearProportion = this.tick / this.reachTime,
        armonicProportion = Math.sin(linearProportion * TauQuarter),
        x = this.fireworkStartX + linearProportion * this.fireworkDx,
        y = this.fireworkStartY + armonicProportion * this.fireworkDy;
      if (this.prevPoints.length > opts.fireworkPrevPoints)
        this.prevPoints.shift();
      this.prevPoints.push([x, y, linearProportion * this.lineWidth]);
      var lineWidthProportion = 1 / (this.prevPoints.length - 1);
      for (var i = 1; i < this.prevPoints.length; ++i) {
        var point = this.prevPoints[i],
          point2 = this.prevPoints[i - 1];
        ctx.strokeStyle = this.alphaColor.replace(
          "alp",
          i / this.prevPoints.length
        );
        ctx.lineWidth = point[2] * lineWidthProportion * i;
        ctx.beginPath();
        ctx.moveTo(point[0], point[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
      }
      if (this.tick >= this.reachTime) {
        this.phase = "contemplate";
        // Pastikan posisi x dan y di-set ke target
        this.x = this.fireworkTargetX;
        this.y = this.fireworkTargetY;

        this.circleFinalSize =
          opts.fireworkCircleBaseSize +
          opts.fireworkCircleAddedSize * Math.random();
        this.circleCompleteTime =
          (opts.fireworkCircleBaseTime +
            opts.fireworkCircleAddedTime * Math.random()) |
          0;
        this.circleCreating = true;
        this.circleFading = false;

        this.circleFadeTime =
          (opts.fireworkCircleFadeBaseTime +
            opts.fireworkCircleFadeAddedTime * Math.random()) |
          0;
        this.tick = 0;
        this.tick2 = 0;

        this.shards = [];

        var shardCount =
            (opts.fireworkBaseShards +
              opts.fireworkAddedShards * Math.random()) |
            0,
          angle = Tau / shardCount,
          cos = Math.cos(angle),
          sin = Math.sin(angle),
          x = 1,
          y = 0;

        for (var i = 0; i < shardCount; ++i) {
          var x1 = x;
          x = x * cos - y * sin;
          y = y * cos + x1 * sin;

          this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
        }
      }
    }
  } else if (this.phase === "contemplate") {
    ++this.tick;

    if (this.circleCreating) {
      ++this.tick2;
      var proportion = this.tick2 / this.circleCompleteTime,
        armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor
        .replace("light", 50 + 50 * proportion)
        .replace("alp", proportion);
      ctx.beginPath();
      ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
      ctx.fill();

      if (this.tick2 > this.circleCompleteTime) {
        this.tick2 = 0;
        this.circleCreating = false;
        this.circleFading = true;
      }
    } else if (this.circleFading) {
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      ++this.tick2;
      var proportion = this.tick2 / this.circleFadeTime,
        armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor
        .replace("light", 100)
        .replace("alp", 1 - armonic);
      ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
      ctx.fill();

      if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
    } else {
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
    }

    for (var i = 0; i < this.shards.length; ++i) {
      this.shards[i].step();

      if (!this.shards[i].alive) {
        this.shards.splice(i, 1);
        --i;
      }
    }

    if (this.tick > opts.letterContemplatingWaitTime) {
      this.phase = "balloon";

      this.tick = 0;
      this.spawning = true;
      this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
      this.inflating = false;
      this.inflateTime =
        (opts.balloonBaseInflateTime +
          opts.balloonAddedInflateTime * Math.random()) |
        0;
      this.size =
        (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;

      var rad =
          opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
        vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

      this.vx = Math.cos(rad) * vel;
      this.vy = Math.sin(rad) * vel;
    }
  } else if (this.phase === "balloon") {
    ctx.strokeStyle = this.lightColor.replace("light", 80);

    if (this.spawning) {
      ++this.tick;
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      if (this.tick >= this.spawnTime) {
        this.tick = 0;
        this.spawning = false;
        this.inflating = true;
      }
    } else if (this.inflating) {
      ++this.tick;

      var proportion = this.tick / this.inflateTime,
        x = (this.cx = this.x),
        y = (this.cy = this.y - this.size * proportion);

      ctx.fillStyle = this.alphaColor.replace("alp", proportion);
      ctx.beginPath();
      generateBalloonPath(x, y, this.size * proportion);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, this.y);
      ctx.stroke();

      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      if (this.tick >= this.inflateTime) {
        this.tick = 0;
        this.inflating = false;
      }
    } else {
      this.cx += this.vx;
      this.cy += this.vy += opts.upFlow;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      generateBalloonPath(this.cx, this.cy, this.size);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.lineTo(this.cx, this.cy + this.size);
      ctx.stroke();

      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);

      if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw)
        this.phase = "done";
    }
  }
};
// --- Kelas Shard: pecahan kembang api ---
function Shard(x, y, vx, vy, color) {
  var vel =
    opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
  this.vx = vx * vel;
  this.vy = vy * vel;
  this.x = x;
  this.y = y;
  this.prevPoints = [[x, y]];
  this.color = color;
  this.alive = true;
  this.size =
    opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function () {
  this.x += this.vx;
  this.y += this.vy += opts.gravity;

  if (this.prevPoints.length > opts.fireworkShardPrevPoints)
    this.prevPoints.shift();

  this.prevPoints.push([this.x, this.y]);

  var lineWidthProportion = this.size / this.prevPoints.length;

  for (var k = 0; k < this.prevPoints.length - 1; ++k) {
    var point = this.prevPoints[k],
      point2 = this.prevPoints[k + 1];

    ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
    ctx.lineWidth = k * lineWidthProportion;
    ctx.beginPath();
    ctx.moveTo(point[0], point[1]);
    ctx.lineTo(point2[0], point2[1]);
    ctx.stroke();
  }

  if (this.prevPoints[0][1] > hh) this.alive = false;
};

// --- Fungsi generateBalloonPath: menggambar bentuk balon ---
function generateBalloonPath(x, y, size) {
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x - size / 2,
    y - size / 2,
    x - size / 4,
    y - size,
    x,
    y - size
  );
  ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
}

// --- Fungsi animasi utama ---
function anim() {
  window.requestAnimationFrame(anim);
  // Reset transform dan clear canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0a0e2c";
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(hw, hh);
  var done = true;
  for (var l = 0; l < letters.length; ++l) {
    letters[l].step();
    if (letters[l].phase !== "done") done = false;
  }
  ctx.restore();
  if (done) for (var l = 0; l < letters.length; ++l) letters[l].reset();
}

// --- Fungsi initLetters: inisialisasi posisi dan karakter ---
function initLetters() {
  letters.length = 0;
  let shiftY = h * 0.05;
  let shiftX = w * 0.05;
  for (let i = 0; i < opts.strings.length; ++i) {
    for (var j = 0; j < opts.strings[i].length; ++j) {
      letters.push(
        new Letter(
          opts.strings[i][j],
          j * opts.charSpacing +
            opts.charSpacing / 2 -
            (opts.strings[i].length * opts.charSize) / 2 - shiftX,
          i * opts.lineHeight +
            opts.lineHeight / 2 -
            (opts.strings.length * opts.lineHeight) / 2 - shiftY
        )
      );
    }
  }
}

initLetters();
anim();

// --- Event handler untuk resize, orientation, dan DOMContentLoaded ---
window.addEventListener("resize", function () {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  hw = w / 2;
  hh = h / 2;
  ctx.font = opts.charSize + "px Poppins";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  initLetters();
  positionElements();
});
window.addEventListener("orientationchange", function () {
  setTimeout(function() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    hw = w / 2;
    hh = h / 2;
    ctx.font = opts.charSize + "px Poppins";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    initLetters();
    positionElements();
  }, 300); // beri delay agar viewport update saat orientasi berubah
});
window.addEventListener('DOMContentLoaded', positionElements);

// --- Mencegah klik kanan pada halaman (kecuali jika Ctrl/Cmd ditekan) ---
document.addEventListener('contextmenu', function(e) {
  if (e.ctrlKey || e.metaKey) return;
  e.preventDefault();
});

// --- Bagian tombol suara dan audio ---
const tombol = document.querySelector('.Tombol');
const audio = document.getElementById('audioTombol');

// mencegah klik kanan pada tombol suara dan teken lama tombol
const icon = document.querySelector('.Tombol img');
icon.addEventListener('contextmenu', function(e) {
  if (e.ctrlKey || e.metaKey) return;
  e.preventDefault();
});

tombol.addEventListener('contextmenu', function(e) {
  if (e.ctrlKey || e.metaKey) return;
  e.preventDefault();
});

audio.addEventListener('contextmenu', function(e) {
  if (e.ctrlKey || e.metaKey) return;
  e.preventDefault();
});

// ubah semua menjadi false pada awal
let audioVisible = false;
let audioStartedByGesture = false; // audio hanya diputar sekali oleh gesture
let isDebouncing = false; // untuk debounce animasi tombol suara
let isAnimatingTombol = false; // flag animasi tombol

// --- Fungsi playAudioOnUserGesture: memulai audio saat user interaksi pertama ---
function playAudioOnUserGesture() {
  if (!audioVisible && !audioStartedByGesture) {
    audio.play();
    audioStartedByGesture = true;
  }
}

// Untuk perangkat mobile (klik area kosong)
window.addEventListener('touchstart', function(e) {
  // Pastikan yang diklik adalah canvas
  if (e.target === c) {
    playAudioOnUserGesture();
  }
}, { once: true });

// Untuk desktop (klik area kosong)
window.addEventListener('click', function(e) {
  // Pastikan bukan klik pada tombol suara
  if (!tombol.contains(e.target)) {
    playAudioOnUserGesture();
  }
}, { once: true });

// --- Mencegah klik kanan pada kontrol audio ---
audio.setAttribute('controls', ''); // pastikan kontrol audio muncul
audio.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// tombol suara event
tombol.addEventListener('click', function(e) {
  if (isDebouncing || isAnimatingTombol) return; // abaikan klik jika sedang debounce/animasi
  isDebouncing = true;
  isAnimatingTombol = true;
  setTimeout(() => { isDebouncing = false; }, 300);

  if (!audioVisible) {
    audio.play();
    audio.style.display = 'block';
    audio.focus();
    tombol.style.transform = 'translateY(20px)';
    setTimeout(() => {
      tombol.style.transform = 'translateY(0)';
      audioVisible = true;
      audioStartedByGesture = true; // jika pengguna klik icon suara sebelum gesture pertama langsung true
      isAnimatingTombol = false;
    }, 200);
  } else {
    // menghilangkan audio
    audio.style.display = 'none';
    tombol.style.transform = 'translateY(0)';
    setTimeout(() => {
      tombol.style.transform = 'translateY(20px)';
      audioVisible = false;
      isAnimatingTombol = false;
    }, 200);
  }
});

// --- Fungsi positionElements: mengatur posisi tombol dan teks kanan ---
const teksKanan = document.querySelector('.TeksKanan');

function positionElements() {
  if (tombol) {
    tombol.style.position = 'fixed';
    tombol.style.left = '20px';
    tombol.style.bottom = '40px';
    tombol.style.top = '';
    tombol.style.right = '';
  }
  if (teksKanan) {
    teksKanan.style.position = 'fixed';
    teksKanan.style.right = '20px';
    teksKanan.style.top = '1px';
    teksKanan.style.bottom = '';
    teksKanan.style.left = '';
  }
}