export class UserModel
{
	constructor(private idToken:string,
		private email:string,
		private tokenExpirationTime:number,
		private gender:string,
		private names:string)
	{

	}
	get token()
	{
		return this.idToken;
	}
	get userEmail()
	{
		return this.email;
	} 

	get tokenTime()
	{
		return this.tokenExpirationTime;
	}
    get userGender()
    {
    	return this.gender;
    }

    get userName()
    {
    	return this.names; 
    }
    get expirationTime()
    {
    	return this.tokenExpirationTime;
    }


}
export interface UserModelSchema
{
	idToken:string,
	email:string,
	tokenExpirationTime:number,
	gender:string,
	names:string

}