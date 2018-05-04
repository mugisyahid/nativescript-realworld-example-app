import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { tap, map, catchError } from "rxjs/operators";
import "rxjs/add/observable/throw";
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { setString, getString } from "application-settings";
import { ConduitService } from "~/service/ConduitService";
import { User } from "~/model/User";
import { AbstractHttpService } from "~/service/AbstractHttpService";
import { Profile } from "~/model/Profile";

/**
 *
 */
@Injectable()
export class UserService extends AbstractHttpService {
    /**
     *
     * @param http
     */
    constructor(protected http: HttpClient) {
        super(http);
    }

    /**
     *
     * @param email
     * @param password
     */
    public login(email: string, password: string) {
        return this.post("/users/login", {
            user: {
                email,
                password
            }
        }).pipe(
            map((data: any) => data.user),
            tap((user: User) => {
                UserService.Token = user.token;
            }),
            catchError(this.handleError)
        );
    }

    /**
     *
     * @param username
     * @param email
     * @param password
     */
    public register(username: string, email: string, password: string) {
        return this.post("/users", {
            user: {
                email,
                password
            }
        }).pipe(
            map((data: any) => data.user),
            tap((user: User) => {
                UserService.Token = user.token;
            }),
            catchError(this.handleError)
        );
    }

    /**
     *
     */
    public getUser() {
        if (!UserService.IsLoggedIn()) {
            return RxObservable.throw("Login");
        }
        return this.get("/user").pipe(
            map((data: any) => data.user),
            tap((user: User) => {
                UserService.Token = user.token;
            }),
            catchError(this.handleError)
        );
    }

    /**
     *
     * @param user The updated user object
     */
    public setUser(user: User) {
        if (!UserService.IsLoggedIn()) {
            return RxObservable.throw("Login");
        }
        return this.put("/user", {
            user: {
                email: user.email,
                username: user.username,
                image: user.image,
                bio: user.bio
            }
        }).pipe(
            map((data: any) => data.user),
            tap((updatedUser: User) => {
                UserService.Token = updatedUser.token;
            }),
            catchError(this.handleError)
        );
    }

    /**
     *
     * @param username
     */
    public getProfile(username: string) {
        return this.get(`/profiles/${username}`).pipe(map((data: any) => data.profile), catchError(this.handleError));
    }

    /**
     *
     * @param username
     * @param follow true if to follow, false if to unfollow
     */
    public followUser(username: string, follow: boolean = true) {
        if (!UserService.IsLoggedIn()) {
            return RxObservable.throw("Login");
        }
        let url: string = `/profiles/${username}/follow`;
        let request;
        if (follow) {
            request = this.post(url);
        } else {
            request = this.delete(url);
        }
        return request.pipe(map((data: any) => data.profile), catchError(this.handleError));
    }

    /**
     *
     */
    public static IsLoggedIn(): boolean {
        return !!getString("token");
    }

    /**
     *
     */
    public static get Token(): string {
        return getString("token", null);
    }

    /**
     *
     */
    public static set Token(token: string) {
        setString("token", token);
    }
}