import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ACCESS_TOKEN, GEOCODING } from './.constants';
const headers = new Headers({
	Authorization: `token ${ACCESS_TOKEN}`,
});
@Injectable()
export class GitMatchService {
	constructor(private http: Http) {}
	encode = str => {
		return encodeURIComponent(str);
	};
	getLocation = location => {
		location = this.encode(location.toLowerCase());
		console.log(location);
		return this.http.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEOCODING}`,
		);
	};
	getUserName = username => {
		username = this.encode(username);
		let observArray = [];
		observArray.push(
			this.http.get(`https://api.github.com/users/${username}`, {
				headers: headers,
			}),
		);
		observArray.push(
			this.http.get(
				`https://api.github.com/users/${username}/repos?page=1&per_page=100&sort=updated`,
				{ headers: headers },
			),
		);
		return Observable.forkJoin(observArray);
	};

	getLocalDevelopers = (location, language) => {
		location = this.removeSpace(location);
		location = this.encode(location);
		console.log(
			`https://api.github.com/search/users?q=location%3A${location}${language}`,
		);
		return this.http.get(
			`https://api.github.com/search/users?q=location%3A${location}${language}`,
			{ headers: headers },
		);
	};
	removeSpace(string) {
		return string.split(' ').join('-');
	}
	getAllUserRepos = usernames => {
		let observArray = [];
		for (let i = 0; i < usernames.length; i++) {
			observArray.push(this.getUserName(usernames[i].login));
		}
		console.log('Finished here');
		return Observable.forkJoin(observArray);
	};
}
