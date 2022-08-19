const frame = new Frame(
  "fit",
  window.screen.width,
  window.screen.height,
  null,
  darker,
  "puzzle.jpg",
  "http://github.mariviana.com.br/k-puzzle/assets/images/"
);
frame.on("ready", () => {
  zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

  let stage = frame.stage;
  let stageW = frame.width;
  let stageH = frame.height;

  // REFERENCES for ZIM at http://zimjs.com
  // see http://zimjs.com/learn.html for video and code tutorials
  // see http://zimjs.com/docs.html for documentation
  // see https://www.youtube.com/watch?v=pUjHFptXspM for INTRO to ZIM
  // see https://www.youtube.com/watch?v=v7OT0YrDWiY for INTRO to CODE

  // DOCS FOR ITEMS USED
  // https://zimjs.com/docs.html?item=Frame
  // https://zimjs.com/docs.html?item=Container
  // https://zimjs.com/docs.html?item=Rectangle
  // https://zimjs.com/docs.html?item=Poly
  // https://zimjs.com/docs.html?item=Label
  // https://zimjs.com/docs.html?item=Button
  // https://zimjs.com/docs.html?item=CheckBox
  // https://zimjs.com/docs.html?item=tap
  // https://zimjs.com/docs.html?item=drag
  // https://zimjs.com/docs.html?item=mouse
  // https://zimjs.com/docs.html?item=noMouse
  // https://zimjs.com/docs.html?item=wire
  // https://zimjs.com/docs.html?item=hitTestReg
  // https://zimjs.com/docs.html?item=animate
  // https://zimjs.com/docs.html?item=loop
  // https://zimjs.com/docs.html?item=sha
  // https://zimjs.com/docs.html?item=pos
  // https://zimjs.com/docs.html?item=loc
  // https://zimjs.com/docs.html?item=mov
  // https://zimjs.com/docs.html?item=top
  // https://zimjs.com/docs.html?item=bot
  // https://zimjs.com/docs.html?item=ord
  // https://zimjs.com/docs.html?item=alp
  // https://zimjs.com/docs.html?item=hov
  // https://zimjs.com/docs.html?item=sca
  // https://zimjs.com/docs.html?item=addTo
  // https://zimjs.com/docs.html?item=removeFrom
  // https://zimjs.com/docs.html?item=centerReg
  // https://zimjs.com/docs.html?item=center
  // https://zimjs.com/docs.html?item=setMask
  // https://zimjs.com/docs.html?item=Tile
  // https://zimjs.com/docs.html?item=Emitter
  // https://zimjs.com/docs.html?item=Generator
  // https://zimjs.com/docs.html?item=chop
  // https://zimjs.com/docs.html?item=shuffle
  // https://zimjs.com/docs.html?item=rand
  // https://zimjs.com/docs.html?item=timeout
  // https://zimjs.com/docs.html?item=getQueryString
  // https://zimjs.com/docs.html?item=darken
  // https://zimjs.com/docs.html?item=mobile
  // https://zimjs.com/docs.html?item=zog
  // https://zimjs.com/docs.html?item=zgo
  // https://zimjs.com/docs.html?item=STYLE

  const mob = mobile();

  class Piece extends Shape {
    constructor(
      w = 100,
      h = 100,
      format = [1, 1, 1, 1],
      s = black,
      ss = 4,
      f = white
    ) {
      super(w, h);
      const p = Piece.part;
      const g = Piece.gap;
      this.s(s).ss(ss).f(f).mt(0, 0);
      if (format[0] == 0) this.lt(w, 0);
      else {
        this.lt(w * p, 0);
        let s = format[0] == 1 ? -1 : 1;
        this.ct(w * (p - g / 2), s * w * g, w / 2, s * w * g);
        this.ct(w * (p + g + g / 2), s * w * g, w * (1 - p), 0);
        this.lt(w, 0);
      }
      if (format[1] == 0) this.lt(w, h);
      else {
        this.lt(w, h * p);
        let s = format[1] == 1 ? 1 : -1;
        this.ct(w + s * w * g, h * (p - g / 2), w + s * w * g, h / 2);
        this.ct(w + s * w * g, h * (p + g + g / 2), w, h * (1 - p));
        this.lt(w, h);
      }
      if (format[2] == 0) this.lt(0, h);
      else {
        this.lt(w * (1 - p), h);
        let s = format[2] == 1 ? 1 : -1;
        this.ct(w * (p + g + g / 2), h + s * w * g, w / 2, h + s * w * g);
        this.ct(w * (p - g / 2), h + s * w * g, w * p, h + 0);
        this.lt(0, h);
      }
      if (format[3] == 0) this.lt(0, 0);
      else {
        this.lt(0, h * (1 - p));
        let s = format[3] == 1 ? -1 : 1;
        this.ct(s * w * g, h * (p + g + g / 2), s * w * g, h / 2);
        this.ct(s * w * g, h * (p - g / 2), 0, h * p);
        this.lt(0, 0);
      }
      this.cp();
    }
  }
  Piece.part = 0.37;
  Piece.gap = 1 - Piece.part * 2;

  // PUZZLE SIZE

  let numX = 4;
  let numY = 6;
  const obj = getQueryString();
  if (obj.col) numX = Math.min(14, Number(obj.col));
  if (obj.row) numY = Math.min(10, Number(obj.row));

  // PICTURE

  const pic = asset("puzzle.jpg").clone().center().alp(0.3).vis(false);
  const w = pic.width / numX;
  const h = pic.height / numY;

  const extra = Math.max(w, h) * Piece.gap;
  const pics = chop(asset("puzzle.jpg"), numX, numY, false, extra);

  // PIECES

  let count = 0;
  let lastX = rand() > 0.5 ? 1 : -1;
  let lastYs = [];
  loop(numX, (i) => {
    lastYs.push(rand() > 0.5 ? 1 : -1);
  });
  function makePiece() {
    let currentX = lastX * -1;
    let currentY = lastYs[count % numX] * -1;
    let nextX = rand() > 0.5 ? 1 : -1;
    let nextY = rand() > 0.5 ? 1 : -1;
    // top, right, bottom, left
    let format = [currentY, nextX, nextY, currentX];
    lastX = nextX;
    lastYs[count % numX] = nextY;

    // override edges to 0
    if (count < numX) format[0] = 0;
    else if (count >= numX * numY - numX) format[2] = 0;
    if (count % numX == 0) format[3] = 0;
    else if ((count - numX + 1) % numX == 0) format[1] = 0;

    // make a container to hold jigsaw shape and later picture part
    let piece = new Container(w, h).centerReg({ add: false });
    piece.puzzle = new Piece(w, h, format).addTo(piece);
    piece.mouseChildren = false;
    count++;
    return piece;
  }

  const pieces = new Tile({
    obj: makePiece,
    cols: numX,
    rows: numY,
    clone: false,
  })
    .center()
    .drag(stage)
    .animate({
      props: { alpha: 1 },
      time: 0.1,
      sequence: 0.05,
    });

  // HINT AND SNAP HIT BOX

  const outline = new Rectangle(pic.width, pic.height, clear, mist, 4)
    .center()
    .ord(-1);
  const hint = pieces
    .clone(true)
    .center()
    .ord(-1)
    .cache(-5, -5, pic.width + 10, pic.height + 10)
    .alp(0.2)
    .vis(0);

  const snap = 50;
  loop(hint, (h) => {
    h.box = new Rectangle(snap, snap).centerReg(h).vis(0);
  });

  const padding = 50;
  const rotate = true;
  loop(pieces, (piece, i) => {
    piece.alp(0);
    pics[i].addTo(piece).setMask(piece.puzzle);

    if (mob)
      piece.cache(-100, -100, piece.width + 200, piece.width + 200);
    if (rotate) {
      piece.rotation = shuffle([0, 90, 180, 270])[0];
      piece.tap({
        time: 0.5,
        call: () => {
          pieces.noMouse();
          piece.animate({
            props: { rotation: String(frame.shiftKey ? -90 : 90) },
            time: 0.2,
            call: () => {
              pieces.mouse();
              test(piece);
            },
          });
          stage.update();
        },
        call2: () => {
          // if no tap
          test(piece);
        },
      });
    } else {
      piece.on("pressup", () => {
        test(piece);
      });
    }
    piece.on("pressdown", () => {
      if (!mob) piece.sha("rgba(0,0,0,.4)", 5, 5, 5);
    });

    piece.loc(
      padding + w / 2 + rand(stageW - w - padding * 2) - pieces.x,
      padding + h / 2 + rand(stageH - h - padding * 2) - pieces.y
    );
  });

  const emitter = new Emitter({
    obj: new Poly({ min: 40, max: 70 }, [5, 6], 0.5, [
      yellow,
      yellow,
      yellow,
    ]),
    num: 2,
    force: 6,
    startPaused: true,
  });

  const num = numX * numY;
  let placed = 0;
  STYLE = { color: "#fefefe", size: 20 };
  const stats = new Label({
    text: `Você ainda não possui celebrações!`,
    italic: true,
    align: CENTER,
    color: "#000",
    backgroundColor: yellow,
  })
    .centerReg()
    .pos(0, 80, CENTER, TOP);

  function test(piece) {
    piece.sha(-1);
    let box = hint.items[piece.tileNum].box;
    if (piece.rotation % 360 == 0 && box.hitTestReg(piece)) {
      piece.loc(box).bot().noMouse();
      emitter.loc(box).spurt(50);
      placed++;
      if (placed == num) {
        stats.text = `Perfil Campeão! ${num} peças colocadas, receba 500 Kryptocoins`;
        timeout(1, function () {
          emitter.emitterForce = 20;
          emitter.center().mov(0, -165).spurt(100);
        });
        timeout(2, function () {
          hintCheck.removeFrom();
          picCheck.removeFrom();
          picCheck.checked = true;
          pieces.animate({ alpha: 0 }, 0.7);
          outline.animate({ alpha: 0 }, 0.7);
          hint.animate({ alpha: 0 }, 0.7);
          pic.alp(0).animate({ alpha: 1 }, 0.7);
          document.body.classList.add("winning");
          setTimeout(() => {
            document.body.classList.remove("winning");
          }, 5000);
          new Button({
            label: "NOVO JOGO",
            color: black,
            corner: [0, 0, 0, 0],
            backgroundColor: "#fefefe",
            rollBackgroundColor: "#fefefe",
          })
            .sca(0.5)
            .pos(0, 150, CENTER, BOTTOM)
            .alp(0)
            .animate({ alpha: 1 })
            .tap(() => {
              zgo("http://github.mariviana.com.br/k-puzzle/", "_parent");
            });
        });
      } else
        stats.text = `RH ADM celebrou com você: \n ${placed} de ${num} peças colocadas`;
    } else stage.update();
  }

  Style.addType("CheckBox", {
    borderColor: "#fefefe",
    backgroundColor: "#eee",
  });
  const hintCheck = new CheckBox(22, "Traços")
    .alp(0.8)
    .pos(-50, 60, CENTER, BOTTOM)
    .wire({ target: hint, prop: "visible", input: "checked" });
  const picCheck = new CheckBox(22, "Imagem")
    .alp(0.8)
    .pos(50, 60, CENTER, BOTTOM)
    .wire({ target: pic, prop: "visible", input: "checked" });

  new Label({text: "Vai ter - Quebra cabeça", font:"courier"}).pos(0, 30, CENTER);
  const mariviana = new Label("𝘔𝘢𝘳𝘪 𝘝𝘪𝘢𝘯𝘢 © 2022")
    .sca(0.5)
    .pos(0, 23, CENTER, BOTTOM)
    .hov(purple)
    .tap(() => {
      mariviana.color = "#fefefe";
      zgo("https://mariviana.com.br", "_blank");
    });

  pieces.top();

  stage.update();
});
