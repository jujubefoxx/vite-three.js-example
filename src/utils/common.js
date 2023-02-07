
function commonListener(camera,renderer){
    // 双击进入退出全屏
    window.addEventListener("dblclick", () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            // console.log(renderer)
            renderer.domElement.requestFullscreen();
        }
    })
    // 屏幕自适应
    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
        // 更新宽高比
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
export default commonListener;