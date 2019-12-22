import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { HomePage } from '../home/home.page';
import { HomePageModule } from '../home/home.module';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-sehaj-paath',
    templateUrl: './sehaj-paath.page.html',
    styleUrls: ['./sehaj-paath.page.scss'],
})
export class SehajPaathPage implements OnInit {

    private isProgressFormHidden: boolean = true;
    private isProgressBtnHidden: boolean = false;
    private isHomeBtnHidden: boolean = true;
    private currentAngs: number = null;
    private angs: number;
    private currentProgress = 0;
    private sehajPaathId: number;

    constructor(public navCtrl: NavController, route: ActivatedRoute, public sqlite: SQLite) {
        this.sehajPaathId = parseInt(route.snapshot.paramMap.get('id'));
        this.updateProgress();
    }

    ngOnInit() {
    }

    async updateProgress() {
        if (this.currentAngs === null) {
            await HomePage.databaseService.getLastRoll(this.sehajPaathId)
            .then((data) => {
                if (data.rows.length === 0) {
                    this.angs = 1;
                } else {
                    this.angs = data.rows.item(0).finish_ang;
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }

        this.currentAngs = this.angs;
        this.currentProgress = (this.currentAngs / 1430);
    }

    addProgress() {
        this.isProgressFormHidden = false;
        this.isProgressBtnHidden = true;
    }

    hideProgressForm() {
        this.isProgressFormHidden = true;
        this.isProgressBtnHidden = false;
    }

    saveCurrentAngs() {
        HomePage.databaseService.saveRoll(this.sehajPaathId, this.currentAngs, this.angs);
        this.updateProgress();
        this.hideProgressForm();
    }

    markAsSampooran() {
        if (this.currentAngs !== 1430) {
            this.angs = 1430;
            HomePage.databaseService.saveRoll(this.sehajPaathId, this.currentAngs, this.angs);
            this.updateProgress();
        }

        HomePage.databaseService.markAsSampooran(this.sehajPaathId);
        this.isProgressFormHidden = true;
        this.isProgressBtnHidden = true;
        this.isHomeBtnHidden = false;
    }

    goToHome() {
        this.navCtrl.navigateForward('/home');
    }
}
