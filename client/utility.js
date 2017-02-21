/**
 * Created by gjr8050 on 2/21/2017.
 */

function getTargetPosition(e){
    const box = e.target;
    return {x: e.clientX - box.offsetLeft, y: e.clientY - box.offsetTop};
}