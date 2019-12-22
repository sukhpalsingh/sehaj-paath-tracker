import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private db: SQLiteObject;

    constructor(private sqlite: SQLite) {
    }

    async openDatabase() {
        return await this.sqlite.create({
            name: 'sehaj-paath-tracker.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            this.db = db;
        });
    }

    async createSchema() {
        return await this.db.transaction(function(tx) {
            // tx.executeSql('DROP TABLE sehaj_paaths');
            // tx.executeSql('DROP TABLE rolls');
            // tx.executeSql('DROP TABLE app_version');

            tx.executeSql('CREATE TABLE IF NOT EXISTS sehaj_paaths(id INTEGER PRIMARY KEY AUTOINCREMENT, pothi INTEGER, start_date DATETIME, end_date DATETIME, expected_end_date DATE)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS rolls(id INTEGER PRIMARY KEY AUTOINCREMENT, sehaj_paath_id INTEGER, start_ang INTEGER, finish_ang INTEGER, attended_at DATETIME)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS app_version(id INTEGER PRIMARY KEY AUTOINCREMENT, version varchar)');
        })
        .catch((message) => {
            console.log(message);
            console.log('syntax error3');
        });

        // await this.db.executeSql('select count(*) as count from rolls', [])
        //     .then((data) => {
        //         return data.rows.item(0).count;
        //     })
        //     .catch((message) => console.log(message));
    }

    currentSehajPaaths() {
        return this.db.executeSql('select * from sehaj_paaths where end_date is null', []);
    }

    startSehajPaath(pothi) {
        return this.db.executeSql('INSERT INTO sehaj_paaths(pothi, start_date) values (' + pothi + ', CURRENT_TIMESTAMP)', []);
    }

    getLastRoll(id) {
        return this.db.executeSql('SELECT * FROM rolls where id in (SELECT max(id) FROM rolls where sehaj_paath_id = ' + id + ')', []);
    }

    saveRoll(sehajPaathId, startAng, endAng) {
        return this.db.executeSql(
            'INSERT INTO rolls(sehaj_paath_id, start_ang, finish_ang, attended_at) values (' + sehajPaathId + ', ' + startAng + ', ' + endAng + ',CURRENT_TIMESTAMP)',
            []
        );
    }

    markAsSampooran(sehajPaathId) {
        return this.db.executeSql(
            'UPDATE sehaj_paaths SET end_date = CURRENT_TIMESTAMP WHERE id = ' + sehajPaathId,
            []
        );
    }
}
