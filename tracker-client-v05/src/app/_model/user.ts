export class User {
  constructor(public id:string="",public username:string="",public email:string="",
              public isLoggedIn:boolean=false,public isAdmin:boolean=false,
              public firstName:string="",public lastName:string="",public sex="male",
              public address="",public postalCode="",public city:string="",public country:string=""){
  }
}

