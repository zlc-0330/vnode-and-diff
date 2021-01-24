import patchVnode from './patchVnode.js';
import createElement from './createElement.js';
import patch from './patch.js';
// 判断是否是同一个虚拟节点
function checkSameVnode(a, b) {
    return a.sel == b.sel && a.key == b.key;
}
export default function updateChildren(parentElm, oldCh, newCh) {
    console.log(oldCh, newCh);
    // 旧前指针
    let oldStartIdx = 0;
    // 新前指针
    let newStartIdx = 0;
    // 旧后指针
    let oldEndIdx = oldCh.length - 1;
    // 新后指针
    let newEndIdx = newCh.length - 1;
    // 旧前节点
    let oldStartVnode = oldCh[0];
    // 新前节点
    let newStartVnode = newCh[0];
    // 旧后节点
    let oldEndVnode = oldCh[oldEndIdx];
    // 新后节点
    let newEndVnode = newCh[newEndIdx];
    let keyMap = null;

    // 遍历结束前
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 判断是否为undefined(被处理过的)
        if (oldStartVnode == null || oldCh[oldStartIdx] == undefined) {
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (oldEndVnode == null || oldCh[oldEndIdx] == undefined) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (newStartVnode == null || newCh[newStartIdx] == undefined) {
            newStartVnode = newCh[++newStartIdx];
        } else if (newEndVnode == null || newCh[newEndIdx] == undefined) {
            newEndVnode = newCh[--newEndIdx];
        } else if (checkSameVnode(oldStartVnode, newStartVnode)) {
            // 旧前与新前
            console.log('旧前与新前');
            // 对比节点反映到真实dom
            patchVnode(oldStartVnode, newStartVnode);
            // 前指针指针后移,节点也随之改变
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (checkSameVnode(oldEndVnode, newEndVnode)) {
            console.log('旧后与新后');
            // 旧后与新后
            // 对比节点反映到真实dom
            patchVnode(oldEndVnode, newEndVnode);
            // 后指针指针前移,节点也随之改变
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (checkSameVnode(oldStartVnode, newEndVnode)) {
            console.log('旧前与新后');

            // 旧前与新后
            // 对比节点反映到真实dom
            patchVnode(oldStartVnode, newEndVnode);
            // 移动节点(插入已经在DOM树上的节点就会移动)，把旧前节点移动到旧后的后面
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            // 指针移动,节点也随之改变
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (checkSameVnode(oldEndVnode, newStartVnode)) {
            console.log('旧后与新前');
            // 旧后与新前
            patchVnode(oldEndVnode, newStartVnode);
            // 移动节点(插入已经在DOM树上的节点就会移动)，把旧后节点移动到旧前的前面
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            // 前指针指针后移,节点也随之改变
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            // 都没命中
            // 制作keyMap映射对象，这样就不用每次都遍历老对象了
            if (!keyMap) {
                keyMap = {};
                for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                    const key = oldCh[i].key;
                    if (key != undefined) {
                        keyMap[key] = i;
                    }
                }
            }
            // 寻找当前这项(newStartIdx)在keymap中的映射的位置序号
            const idxInOld = keyMap[newStartVnode.key];
            // 判断idxInOld是不是undefined
            if (idxInOld == undefined) {
                // 这是新的项，要插入
                parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
            } else {
                // 不是新项，要移动
                // 老节点中需要移动的那项
                const move = oldCh[idxInOld];
                patchVnode(move, newStartVnode);
                // 把这项设置为undefined，表示已处理
                oldCh[idxInOld] = undefined;
                // 移动到oldStartVnode前
                parentElm.insertBefore(move.elm, oldStartVnode.elm);

            }
            // 新节点指针下移
            newStartVnode = newCh[++newStartIdx];
        }
    }
    // 循环结束，看剩余项
    if (newStartIdx <= newEndIdx) {
        // 新节点有剩余，新增节点
        // 遍历newch,添加到老节点之前
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            // insertBefore可以自动识别null，如果是null自动排到队尾
            // 先创建成真实DOM再上树
            parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm);
        }
    } else if (oldStartIdx <= oldEndIdx) {
        console.log(2);
        // 新节点有剩余，删除节点
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (oldCh[i]) {
                parentElm.removeChild(oldCh[i].elm);
            }
        }
    }
};