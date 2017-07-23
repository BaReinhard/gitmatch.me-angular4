import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GitMatchComponent } from './git-match/git-match.component';
import { GitLocationComponent } from './git-location/git-location.component';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { GitMatchService } from './git-match.service';
import { HttpModule } from '@angular/http';
import { ChartModule } from 'angular2-chartjs';
// Routes
const appRoutes: Routes = [
	{ path: 'match', component: GitMatchComponent },
	{ path: 'location', component: GitLocationComponent },
	{
		path: '',
		redirectTo: '/match',
		pathMatch: 'full',
	},
	{ path: 'about', component: AboutComponent },
	{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
	declarations: [
		AppComponent,
		PageNotFoundComponent,
		GitMatchComponent,
		GitLocationComponent,
		HeaderComponent,
		AboutComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(appRoutes, { enableTracing: false }),
		ReactiveFormsModule,
		ScrollToModule.forRoot(),
		HttpModule,
		ChartModule,
	],
	providers: [GitMatchService],
	bootstrap: [AppComponent],
})
export class AppModule {}
