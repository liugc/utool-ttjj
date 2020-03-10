const http = require("http");

let lists = [];

const getFund = (code) => {
  return new Promise((resolve, reject) => {
    let url = `http://fund.eastmoney.com/${code}.html`;
    http.get(url, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        let title = "";
        let description = "";
        let icon = "";
        const reg1 = /<div class="fundDetail-tit"><div style="float: left">(.+?)<span>\(<\/span><span class="ui-num">(.+?)<\/span><\/div>\)<\/div>/;
        const reg2 = /<span class="ui-font-middle ui-color-red ui-num" id="gz_gszzl">(.+?)<\/span>/;
        let matches1 = rawData.match(reg1);
        if (matches1 && matches1.length > 1) {
          title = matches1[1] + "(" + matches1[2] + ")";
        }
        let matches2 = rawData.match(reg2);
        if (matches2 && matches2.length > 0) {
          description = matches2[1];
        }
        if (description.indexOf("+") > -1) {
          icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD6klEQVRYR8VXTYgcRRT+3sx0d1Y9iLgkhOkRMcn2qhc1HiIe/AGzXhTUDYheNApx96LiDwjGSMCDigYkq6CJF0VwIKIXjaDuQcxBEy/qdkyi2L2IISEENFm7emaeVG93T1dP1fTseti6zEzPq/e++t6r974mrPGi1cT/6VrY686Pre/UO+vl/ka3cfrfy5dOX/8LxEr9jQxgwXW2g3gbgLsIkJ8Di4EjAL4E05HJMDo8CphKAP7VzgQ6/BwIj47iMLdhHESDXvV+j44P2zcUgO9au0C1vQBfuaLguTGdBfde9ML4HdN+I4CFlr2HgJcGeeYzANoE/MyoLcr/Cb0mA9cBmAbReHkPAy9PBmKPDoQWgH+V/RAYH5Q2nCLmN2pOfGDzSUQ6Zyc2welF1k4mehrANYoN4WHvD/Fhed8AAL9lTwP4uGTYrgsxu/kvyNNXrhMbMN617f0JI+ra4QWiXXykAEgKrotvizkfRl8VksE00lnUcWuxMFUArn1ArXbe5wXxU7pAKVPPg/lvEM2VT5bt8VvWmwA9WbwdXih2Zr9zAH7TmUKNPy8EO1UXYpuOdkOaBuiVvtJ0yP7Qr4ke3e0tRl8sF3C6Flz7NSI8kyNjnp0I47ny6Q3BMzMtiOOuNcNEsiaSxYzXJ0PxrALAb9lHAdyY2py7tCea7iKWigAqghtBhE2MXajZ8spekRod8wJxUw5A9vbGP3bhatF7XhA9vorgRhB+y3kX4Mcyg85lwpGzI0nByY1jbqfRDUz0a0/OPA+i21JO+9/7qJV0lNPQ6NRbm/5cChMAvmttBdH3/Uqle70w+iyvZNf6Jg+2/LAN5vESANkjivf+qBeIrX0fzj0g/rQfg2/2wviH0QC0bNmYMudtLxA7/CIo5nkvjG/3VbvRAVSl4FfXfpCBB4hofksQvZWy1mclBSCfJ81HsoPa4SKLQ1MwUITMc14Yz5avoFKUGgYq7PeDaEZbhCny73KhwXym7sSuaegMY0AHQg6pbmSF2aSUwmUyELcofaDct8nQiLSFWUiBDsBAIyqM50IndLYTcdIe02VsxSkDOaXEODQRivu1p1+ejEorZqapTLJVDCMkFa9z7LvJtdoN4Lca45MtofhIa6feDIBxUDuMklOt9ThOqd0ForfV0/C+uohfWZkgsV5QxrB0yPxEWR9qJZlBDyaS7BKO3y8PqQysHDoXyXpEJ8lMwsYoSg26UMY6B9Ah4t6Piiil2g0A31eYeH0SDXpQuYaGApoGaO5/yXLwjEktVQLIC3OtXkyU1tt0ppj4TiLcURAuZeKOMeNrYvoqk1zD2vNIDOgcrMnLadVJVvv/f0DVDT+WqnLCAAAAAElFTkSuQmCC";
        } else {
          icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOXSURBVFhHxZdPSFRhEMC/ebquBkGIYrt6S1DXU3USOkRBdQqSDKIu2aWMIDp0CCojCOoQEWhdsktdkjpXUHQIvJSdXBTs5p/EiCBId5++aeZ789773l93KfAHzzczvp2Z/b5538yq7QbkXhclLDX9WrM6sNHuYB02ciu7WpyVMpSr+oE6qDmBgt1/DJzNwwrgEKn7XGuMaYX4Aa2G98u5mTdiy2TLBIrrPT3Ksq6ROOxaamZCOc79pea5OdETyUygs1IaQgvHFao2MdUHqB/gwMhivjwplhipCRQqpTMA+FxUk590vabrq3JgQVss7KK/e+kapKuVTSaIcHY5X34haojEBIqV3lHa61uiuqD6Rk8/sHK/ny3AwppYQ3RhV4tj7zxHz16lZ/eI2QXx9lJ+dlQ0n1gCndXSBVT4WFQNgHq42Wjf/Q7zq2LKZDd2tzds5K4jqiti0oCCi4tN5SeiakIJ6IJrsD6F9jwl81qIrSTVhNp0DpiFacndhavdCE4rMZkWnJyfLlR7XxarfZ+L66XjYg7Bn2UforLDNnmjfPwECuu9R+kWvGq055jbuCRaDLDgJC3pEIn7qQj5s4loH1w/AcMSS+MnQPs8IKILFVzWnjsYVDvS4ShiDO2DfImqMWMFWwBwRCRmdUfOfiryPyO+gi9jxNIJ8NlON3MFJudhviLyPyO+zMNoQGK6CXBj4bvBjNw1XGRUbGO6qregWC1d7rT7XnGRiskj5NOLqRPwupqPd8J5WHiT/o7wK8WV7xrjuP/DR/T+DyKoE2J2ifj0YgY1UCNc+UlJsE3eCgHaRchEJ8D9XGse7tnuAwj3RNSEA7lEbRbCuIguUZ8SUyfAwwTfDbix+HA3oyROiaqhI/SgiCGZ4WcTOmDIpxdTJyCTzDTLwiA3FpE1SUkkkRRcfHGn9Jj2pqegBmiSEYlp1V0twlZJpHxzJb6CNm3E8hPgMUpEF2qp3NVE80lLIi249sHt2cCM5ScgM9yEqxHUz7mlihbCS4KO4I+kfkkLzmgf4dlgwpwXt70dxwcSngMBQ+85t1TuavUMJGA3jkVfzaSViiXAJM6DMpJxY0nrE93Ynf9j587rPY+MZGlzYWICTGz5AngV+FvMRIbSfrr4G8dPwIxtTE2A0fMh4J1QTdQDj+UIN6JzoElmAsy2/jAx4TFKTzLuMBGengKmaLnfUTecWm6efSu2TGpOwOR//jjdZpT6C7jxnC7jKCK8AAAAAElFTkSuQmCC";
        }
        if (title && description) {
          resolve({
            title,
            description,
            icon,
            url,
            code
          });
        } else {
          reject();
        }
      });
    }).on('error', (e) => {
      reject();
    });
  });
}

const getList = (callbackSetList) => {
  let jj = utools.db.get("jj");
  let promiseArr = [];
  if (jj) {
    jj.data.forEach((item) => {
      promiseArr.push(getFund(item));
    });
  }
  Promise.all(promiseArr).then((data) => {
    lists = data;
    callbackSetList(data);
  }).catch(() => {
  });;
}

const getListFromCode = (callbackSetList, code) => {
  getFund(code).then((data) => {
    callbackSetList([data]);
  }).catch(() => {
  });
}

const filterList = (searchWord, callbackSetList) => {
  let data = lists.filter((item) => {
    return item.title.indexOf(searchWord) > -1;
  });
  callbackSetList(data);
}

window.exports = {
  "list": {
    mode: "list",
    args: {
      enter: (action, callbackSetList) => {
        getList(callbackSetList);
      },
      search: (action, searchWord, callbackSetList) => {
        filterList(searchWord, callbackSetList);
      },
      select: (action, itemData) => {
        utools.hideMainWindow()
        const url = itemData.url
        require('electron').shell.openExternal(url)
        utools.outPlugin()
      }
    }
  },
  "add": {
    mode: "list",
    args: {
      enter: (action, callbackSetList) => {
        // utools.db.remove("jj");
      },
      search: (action, searchWord, callbackSetList) => {
        if (searchWord) {
          getListFromCode(callbackSetList, searchWord);
        }
      },
      select: (action, itemData) => {
        utools.hideMainWindow()
        let obj = {};
        obj._id = 'jj';
        let jj = utools.db.get("jj");
        if (jj) {
          if (!jj.data.includes(itemData.code)) {
            jj.data.push(itemData.code);
          }
          obj.data = jj.data;
          obj._rev = jj._rev;
        } else {
          obj.data = [itemData.code];
        }
        utools.db.put(obj);
        utools.outPlugin();
      },
      placeholder: "请输入代码"
    }
  }
}