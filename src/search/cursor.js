var Cursor = {};
var cursorIndex = 0;

var item, list;

Cursor.up = function () {
  if (!cursorIndex) return;
  list[cursorIndex].classList.remove('tab-selected');
  cursorIndex--;

  if (cursorIndex > 0) {
    list[cursorIndex].classList.add('tab-selected');
    console.log('up', cursorIndex);
  }
};

Cursor.down = function () {
  if (cursorIndex > 0 && cursorIndex) {
    list[cursorIndex].classList.remove('tab-selected');
  }

  cursorIndex++;
  list = document.getElementsByClassName('gradient')[0].childNodes;
  console.log(cursorIndex);

  if (cursorIndex) {
    list[cursorIndex].classList.add('tab-selected');
  }
};

Cursor.enter = function() {
  console.log(document.querySelectorAll('.tab-selected')[0].childNodes[1].innerText)
}

module.exports = Cursor;