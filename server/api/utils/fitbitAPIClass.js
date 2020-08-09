// TODO: Review Class option for managing API
//#region
// class fitbitAPI {

//     buildURL(userId, endpoint) {
//         // const userId = await this.getProfileId()
//         // return `https://api.fitbit.com/1/user/${userId}/${endpoint}`
//         const fitbitId = this.getProfileId(userId)
//         return `https://api.fitbit.com/1/user/${fitbitId}/${endpoint}`

//         // *** for loggedIn user?
//         // return `https://api.fitbit.com/1/user/-/${endpoint}`
//     }

//     /** //TODO: REFACTOR! Do I want to bother with caching?
//      //* Get the fitbit user's ID
//      *
//      * @returns {String}
//      * @memberof fitbitAPI
//      */
//     async getProfileId(userId) {
//         // return cache('encodedId', async () => {
//         // return (await this.getProfile()).encodedId;
//         // })
//         const theUser = await User.findByPk(userId)
//         return theUser.fitbitId
//     }

//     /**
//      //* Returns true if the connection to fitbit api has been established
//      *
//      * @returns {Boolean}
//      * @memberof fitbitAPI
//      */
//     async initialized() {
//         return !!(await this.getAccessToken());
//     }

//     /**
//      //* Builds the Basic auth token for oauth refresh
//      *
//      * @readonly
//      * @memberof fitbitAPI
//      */
//     get basicAuthToken() {
//         return Buffer
//         .from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`)
//         .toString('base64');
//     }

//     /** //TODO: Review SECURITY!
//      //* Fetches the api access token from the db
//      *
//      * @returns {String}
//      * @memberof fitbitAPI
//      */
//     async getAccessToken(userId) {
//         const theUser = await User.findByPk(userId)
//         return theUser.fitbitAccessToken
//     }

//     /** //TODO: modify to work with axios?
//      //* Make an authenticated ajax GET
//      *
//      * @param {*} url
//      * @returns
//      * @memberof fitbitAPI
//      */
//     async userRequest(url) {
//         const headers = { 'authorization': `Bearer ${await this.getAccessToken()}` };
//         // const method  = "GET";

//         // return this.request({ url, method, headers });
//         return this.request({url, headers})
//     }

//     /** //TODO: REVIEW!
//      //* Ajax request wrapper, will refresh token and retry if expired
//      *
//      * @param {*} options
//      * @param {boolean} [retry=true]
//      * @returns
//      * @memberof fitbitAPI
//      */
//     async request(options, retry = true) {
//         try {
//         // return await axios(
//         //     _.extend({}, options)
//         // );
//             return await axios.get(`${options.url}`, {headers: options.headers})
//         } catch (error) {
//         // TODO: REFACTOR... waht is going on with this 2nd request, the AccessToken isn't updated...
//         if (error.response.status === 401 && retry) {
//             await this.refreshToken();
//             return this.request(options, false);
//         }
//         throw error;
//         }
//     }

//     /** //TODO: REVIEW!
//      //* Refresh the access token
//      *
//      * @memberof fitbitAPI
//      */
//     async refreshToken(userId) {
//         const url = 'https://api.fitbit.com/oauth2/token'

//         // if (this._refresh) {
//         // return this._refresh;
//         // }
//         if (this.refreshed) {
//             return this.refreshed
//         }

//         const theUser = await User.findByPk(userId)

//         // *** POST request = url, request body, headers
//         this.refreshed = await axios.post(
//             `${url}`,
//             {
//                 'grant_type': 'refresh_token',
//                 'refresh_token': theUser.fitbitRefreshToken,
//                 'expires_in': '31536000'
//             },
//             {
//                 headers: {
//                     'authorization': `Basic ${this.basicAuthToken}`,
//                     'content-type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         )

//         theUser.update({
//             fitbitAccessToken: this.refreshed.access_token,
//             fitbitRefreshToken: this.refreshed.refresh_token
//         })

//         //#region    OLD CODE
//         // this._refresh = axios({
//         // method: 'POST',
//         // headers: {
//         //     'authorization': `Basic ${this.basicAuthToken}`,
//         //     'content-type': 'application/x-www-form-urlencoded'
//         // },
//         // data: qs.stringify({
//         //     grant_type:     'refresh_token',
//         //     refresh_token:  await readString('refresh_token'),
//         //     expires_in:     31536000
//         // }),
//         // url
//         // }).then(async ({ data }) => {
//         // const { accessToken, refreshToken } = data;

//         // await savePair('access_token', accessToken).to('strings');
//         // await savePair('refresh_token', refreshToken).to('strings');
//         // this._refresh = null;
//         // })
//         // .catch((error) => {
//         // this._refresh = null
//         // throw error;
//         // });

//         // return this._refresh;
//         //#endregion
//     }

// }

// module.exports =  new fitbitAPI()
//#endregion
