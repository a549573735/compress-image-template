import { Resources } from './fsresour';
import { DataStore } from './DataStore';
import { Howl } from 'howler';
import { isLongPhone } from '../runtime/util'

class ResourceLoader {
    constructor(loadCb, mainCb) {
        this.loadCb = loadCb || null;
        this.mainCb = mainCb || null;
        const SW = 750, SH =isLongPhone()?1450:1280;
        this.app = new PIXI.Application({ width: SW, height: SH, resolution: 1, view: $('#xCanvas')[0] });
        this.app.SW = SW;
        this.app.SH = SH;
        this.app.stage.interactive = true;
        this.onLoaded();
    }

    onLoaded() {
        LoadingResources=[];
        // let musics=musicResource.reduce((pre,cur) => {
        //     pre[cur.name]=new Howl({
        //         src: [cur.url],
        //         loop: true,
        //         volume: 1,
        //         onload: function () {
        //             console.log('Finished!');
        //         }
        //     })
        //     return pre;
        // },{});

        this.app.loader.add(LoadingResources).load((...args)=>{
            this.loadCb(...args,this.app)
        }).onComplete.add(() => {
            const loader = new PIXI.Loader();
            this.DataStore = DataStore.getInstance();
            // this.DataStore.musics=musics;
            loader.add(Resources).on("progress", this.handleProgress.bind(this)).load(this.mainCb)
        });

    }

    getApp() {
        return this.app;
    }

    handleProgress(loader) {
        // this.progress.text=Math.ceil(loader.progress)+'%';
        // this.mask.position.set(-75 + (loader.progress / 100 * (this.app.SW / 2 )+75), 630)
    }

    static create(loadCallBack, mainCallBack) {
        return new ResourceLoader(loadCallBack, mainCallBack);
    }
}

export default ResourceLoader