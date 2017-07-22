import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ACCESS_TOKEN } from './.constants';
const headers = new Headers({
	Authorization: `token ${ACCESS_TOKEN}`,
});
@Injectable()
export class GitMatchService {
	constructor(private http: Http) {}
	getUserName = username => {
		let observArray = [];
		observArray.push(
			this.http.get(`https://api.github.com/users/${username}`, {
				headers: headers,
			}),
		);
		observArray.push(
			this.http.get(
				`https://api.github.com/users/${username}/repos`,
				{ headers: headers },
			),
		);
		return Observable.forkJoin(observArray);
	};
	getUserRepos = repo => {
		return this.http.get(`https://api.github.com`);
	};
	getLocalDevelopers = location => {
		location = this.removeSpace(location);
		return this.http.get(
			`https://api.github.com/search/users?q=location%3A${location}`,
			{ headers: headers },
		);
	};
	removeSpace(string) {
		return string.split(' ').join('+');
	}
	getAllUserRepos = usernames => {
		let observArray = [];
		for (let i = 0; i < usernames.length; i++) {
			observArray.push(this.getUserName(usernames[i].login));
		}
		return Observable.forkJoin(observArray);
	};
}
