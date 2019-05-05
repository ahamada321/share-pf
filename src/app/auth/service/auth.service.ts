import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

import * as moment from 'moment'
import { JwtHelperService } from '@auth0/angular-jwt'

const jwt = new JwtHelperService();


class DecodedToken {
    exp: number = 0
    username: string = ''
}


@Injectable()
export class AuthService {
    private decodedToken

    constructor(private http: HttpClient) {
        this.decodedToken = JSON.parse(localStorage.getItem('app-meta')) || new DecodedToken()
    }


    private saveToken(token: string):string {
        this.decodedToken = jwt.decodeToken(token)
        localStorage.setItem('app-auth', token)
        localStorage.setItem('app-meta', JSON.stringify(this.decodedToken))

        return token
    }

    private getExpiration() {
        return moment.unix(this.decodedToken.exp)
    }

    public getUserId():string {
        return this.decodedToken.userId
    }

    public getUsername():string {
        return this.decodedToken.username
    }

    public getUserRole():string {
        return this.decodedToken.userRole
    }

    public isAuthenticated():boolean {
        return moment().isBefore(this.getExpiration())
    }

    public getAuthToken():string {
        return localStorage.getItem('app-auth')
    }

    public register(userData: any): Observable<any> {
        return this.http.post('api/v1/users/register', userData)
    }

    public login(userData: any): Observable<any> {
        return this.http.post('api/v1/users/auth', userData).pipe(map(
            (token: string) => this.saveToken(token)))
    }

    public logout() {
        localStorage.removeItem('app-auth')
        localStorage.removeItem('app-meta')
        this.decodedToken = new DecodedToken()
    }

    public sendPasswordResetLink(userData: any): Observable<any> {
        return this.http.post('api/v1/users/reset/', userData)
    }

    public setNewPassword(userData: any, verifyToken: any): Observable<any> {
        return this.http.patch('api/v1/users/reset/' + verifyToken, userData)
    }

    public userActivation(verifyToken: string): Observable<any> {
        return this.http.get('api/v1/users/register/' + verifyToken)
    }

    public getUserById(userId: string): Observable<any> {
        return this.http.get('/api/v1/users/' + userId)
    }

    public getI(): Observable<any> {
        return this.http.get('/api/v1/users/' + this.getUserId())
    }

    public updateUser(userId: string, userData: any): Observable<any> {
        return this.http.patch('/api/v1/users/' + userId, userData)
    }




}