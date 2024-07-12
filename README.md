# K-BANK BLOG
## Functionality:
**For non-authenticated users:**
- User authorization and registration (JWT token is used);
- Viewing the latest articles;
- Viewing popular articles;
- Viewing articles by tag;
- Viewing a specific article and its comments;
- Viewing the latest comments and tags.
 
**For authenticated users:**
- Writing an article;
- Editing and deleting their own articles;
- Writing comments;
- Deleting their own comments.
___
## Entities: ##
1. `User`
   + **_id** (ObjectId, pk, not null)
   + **fullName** (String, not null)
   + **email** (String, unique, not null)
   + **passwordHash** (String, not null)
   + **avatarUrl** (String)
   + **createdAt** (Date, not null)
   +	**updatedAt** (Date, not null)  
2. `Post`
   +	**_id** (ObjectId, pk, not null)
   +	**title** (String, not null)
   +	**text** (String, unique, not null)
   +	**tags** (Array)
   +  **viewsCount** (int)
   +	**commentCount** (int)
   +	**user** (ObjectId, not null, fk) -> `User`
   +	**imageUrl** (String)
   + **createdAt** (Date, not null)
   + **updatedAt** (Date, not null)
3. `Comment`
   +	**_id** (ObjectId, pk, not null) 
   +	**text** (String, unique, not null)
   +	**user** (ObjectId, not null, fk) -> `User`
   +	**post** (ObjectId, not null, fk) -> `Post`
   +	**createdAt** (Date, not null)
   + **updatedAt** (Date, not null)
___
## Screenshots:
![home](https://github.com/EvgenyKuznetsov153502/Kuznetsov_153502_labs_2sem_proga/blob/master/Home.jpg)

![fullPost1](https://github.com/EvgenyKuznetsov153502/Kuznetsov_153502_labs_2sem_proga/blob/master/full.jpg)

![fullPost2](https://github.com/EvgenyKuznetsov153502/Kuznetsov_153502_labs_2sem_proga/blob/master/FULL2.jpg)

![createPost](https://github.com/EvgenyKuznetsov153502/Kuznetsov_153502_labs_2sem_proga/blob/master/createPost.jpg)

![Post](https://github.com/EvgenyKuznetsov153502/Kuznetsov_153502_labs_2sem_proga/blob/master/post.jpg)

![register](https://github.com/EvgenyKuznetsov153502/Kuznetsov_153502_labs_2sem_proga/blob/master/register.jpg)
