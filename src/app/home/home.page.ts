import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { NavController } from '@ionic/angular';
import { SQLite } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

    private hideStartSehajPaathBtn = false;
    public static databaseService : DatabaseService;

    constructor(public navCtrl: NavController, public sqlite : SQLite) {
        // databaseService.waitForDatabase();
        
        // if (HomePage.databaseService.currentSehajPaaths() > 0) {
        //     this.hasCurrentSehajPaath = true;
        // }
        this.updateProgress();
    }

    async openDatabase() {
        HomePage.databaseService = new DatabaseService(this.sqlite);
        await HomePage.databaseService.openDatabase();
        await HomePage.databaseService.createSchema();
    }

    async updateProgress() {
        if (typeof HomePage.databaseService === 'undefined') {
            await this.openDatabase();
        }
        console.log('opening database');
        await HomePage.databaseService.currentSehajPaaths()
            .then((data) => {
                this.hideStartSehajPaathBtn = data.rows.length > 0;
                // console.log(data.rows.item(0));
                if (this.hideStartSehajPaathBtn === true) {
                    // console.log('opened');
                    this.navCtrl.navigateForward('/sehaj-paath/' + data.rows.item(0).id);
                    this.hideStartSehajPaathBtn = false;
                }
            })
            .catch((message) => console.log(message));
    }

    async startSehajPaath() {
        console.log('starting');
        await HomePage.databaseService.startSehajPaath(1)
        .then((data) => {
            this.hideStartSehajPaathBtn = false;
            this.updateProgress();
        })
        .catch((message) => {
            console.log(message);
        });
        
    }

}
