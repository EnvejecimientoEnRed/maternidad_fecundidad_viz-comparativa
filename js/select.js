let x, i, j, l, ll, selElmnt, a, b, c;
let currentSelected = 'nacional', currentSelected_2 = '', currentSelectedNac = 'ambas';
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    let valores = selElmnt.options[j].value.split("_");
    c.setAttribute('data-value', valores[0]);
    c.setAttribute('data-type', valores[1]);
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        let y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        let elemType = e.target.getAttribute('data-type');
        if(elemType == 'ccaa') {
          //Vamos a dejar en display: none la segunda columna y a quitar la que había previamente (y viceversa)
          document.querySelectorAll(`[data-value='${currentSelected}']`)[1].style.display = 'block';
          document.querySelectorAll(`[data-value='${e.target.getAttribute('data-value')}']`)[1].style.display = 'none';

          currentSelected = e.target.getAttribute('data-value');          
        } else if (elemType == 'ccaa-2') {
          //Vamos a dejar en display: none la primera columna y a quitar la que había previamente (y viceversa)
          if(currentSelected_2 != ''){
            document.querySelectorAll(`[data-value='${currentSelected_2}']`)[0].style.display = 'block';
          }          
          document.querySelectorAll(`[data-value='${e.target.getAttribute('data-value')}']`)[0].style.display = 'none';

          currentSelected_2 = e.target.getAttribute('data-value');
        } else {
          currentSelectedNac = e.target.getAttribute('data-value');
        }
        updateChart(currentSelected, currentSelected_2, currentSelectedNac);

        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

document.querySelectorAll(`[data-value='nacional']`)[1].style.display = 'none';

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  let x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);