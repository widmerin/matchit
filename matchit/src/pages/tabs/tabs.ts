import { Component } from '@angular/core';

import { PlayersPage } from '../players/players';
import { StatsPage } from '../stats/stats';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PlayersPage;
  tab3Root = StatsPage;

  constructor() {

  }
}
