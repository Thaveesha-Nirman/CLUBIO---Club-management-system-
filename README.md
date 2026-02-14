___ Clubio — Club Management System ____


* Clubio is a production-style web application designed to streamline university club operations, from membership management to social engagement. By integrating a secure Spring Boot backend with a dynamic React frontend, Clubio provides a centralized hub for campus life.





## Technical Stack


Backend: Spring Boot (Java) with a Layered Architecture: Controller → Service → Repository → Entity.
Frontend: React.js utilizing centralized Axios configurations for API connectivity.
Database: MySQL (SQL) managed via Spring Data JPA.
Security: Stateless session management using JSON Web Tokens (JWT) and Role-Based Authorization.

##  Installation & Setup

1. Database Setup

            *Create a MySQL database named uni_club_db.
            *Update the application.properties file in src/main/resources with your MySQL username and password.

2. Backend Execution (Spring Boot)

            *From the root directory
            *./mvnw spring-boot:run
            *The API will be available at: http://localhost:8080/api/v1.
            

3. Frontend Execution (React)

            *cd club-frontend
            *npm install
            *npm start
            *The application will be available at: http://localhost:3000.


## Beyond CRUD Features


*Advanced Social Interaction: A relational "Like" and "Comment" system where interactions are mapped directly to unique user_email identifiers in the database.

*Role-Based Access Control: Secure routes ensure that administrative actions (like deleting a club) are strictly reserved for ROLE_ADMIN accounts.

*Centralized Error Handling: Implemented HTTP status codes (e.g., 401 Unauthorized, 403 Forbidden) to ensure a reliable and secure user experience.


## API Testing with Postman


*A pre-configured Postman collection and environment are provided in the /postman folder.

*Import the Clubio_API_Collection.json and Clubio_Local_Env.json files.

*Select the CLUBIO-Local environment.

* Ensure the jwt_token variable is updated after login to access protected endpoints.


## The Development Team & Contributions

MEMBER 01 :  
                    
                        Name - Thaveesha
                        GitHub User name - Thaveesha-Nirman
                        Brach name -feature/auth-fullstack-36682
                        GitHub profile link - https://github.com/Thaveesha-Nirman
                        Student id - 36682
                        Role - Identity Architect
                        Files done -   
                                            Back end : 
                                                                *AuthController
                                                                *AuthService
                                                                *JwtService
                                                                *JwtAuthenticationFilter
                                                                *SecurityConfig 

                                            Front end :
                                                                *Login.js
                                                                *Register.js
                                                                *AuthContext.js
                                                                *axiosConfig.js.
                                                            
                                                
                  
MEMBER 02: 
                    
                        Name - A D G Y Ranawaka 
                        GitHub User name - yohaniranawaka63-glitch
                        Brach name - feature/club-join-request-36738
                        GitHub profile link - https://github.com/yohaniranawaka63-glitch
                        Student id - 36738
                        Role - Club Core Lead
                        Files done -   
                                            Back end : 
                                                                *ClubController
                                                                *ClubService
                                                                *ClubRepository
                                                                *Club Entity
                                                                *JoinRequest Entity 

                                            Front end :
                                                                *ExploreClubs.js
                                                                *AllClubs.js
                                                                *ClubProfile.js.


                                                            




 MEMBER 03 :  
                    
                        Name - M A N  Chathuranga
                        GitHub User name - NilakshaChathuranga
                        Brach name - feature/event-coordinator-fullstack-36681
                        GitHub profile link - https://github.com/NilakshaChathuranga
                        Student id - 36681
                        Role - event-coordinator-fullstack
                        Files done -   
                                            Back end : 
                                                                *EventController
                                                                *EventRepository
                                                                *Event Entity 
                                                        

                                            Front end :
                                                                *Login.js
                                                                *Register.js
                                                                *AuthContext.js
                                                                *axiosConfig.js.       

MEMBER 04 :  
                    
                        Name - KWTN Pothuwila
                        GitHub User name -kwtnpothuwila
                        Brach name - feature/social-engine-lead-fullstack-36672
                        GitHub profile link - https://github.com/kwtnpothuwila
                        Student id - 36672
                        Role - social-engine-lead-fullstack
                        Files done -   
                                            Back end : 
                                                                *PostController
                                                                *AuthPostRepositoryService
                                                                *Post Entity 
                                                                *Comment Entity
                                                                *SharedPost Entity 

                                            Front end :
                                                                *CreatePost.js
                                                                *PostCard.js
                                                                

  
  MEMBER 05 :  
                    
                        Name - P K D Nethmika
                        GitHub User name -dinethnethmika
                        Brach name - feature/relationship-lead-fullstack-36704
                        GitHub profile link -https://github.com/dinethnethmika
                        Student id - 36704
                        Role - relationship-lead-fullstack
                        Files done -   
                                            Back end : 
                                                                *FriendshipController
                                                                *FriendshipService
                                                                *JwtService
                                                                *Friendship Entity
                                                                *Membership Entity  

                                            Front end :
                                                                *FriendsList.js
                                                                *FriendRequests.js                                                                 

  
MEMBER 06 :  
                    
                        Name - W.M.D.T.Warshakoon 36567
                        GitHub User name - Dilshan-Warshakoon
                        Brach name - feature/mainly-ui-ux-36567
                        GitHub profile link - https://github.com/Dilshan-Warshakoon
                        Student id -36567
                        Role - Mainly Front End
                        Files done -   
                                            Back end : 
                                                                *WebConfig
                                                                *FileUploadController
                                                                 
                                            Front end :
                                                                *Dashboard.js
                                                                *Sidebar.js
                                                                *UIContext.js
                                                                *App.js.                                                              

 MEMBER 07 :  
                    
                        Name - R P H B Prabodhani 
                        GitHub User name - rphbprabodhani
                        Brach name - feature/management-lead-36992
                        GitHub profile link -https://github.com/rphbprabodhani
                        Student id - 36992
                        Role -management-lead-
                        Files done -   
                                            Back end : 
                                                                *UserRepository
                                                                *User Entity
                                                                

                                            Front end :
                                                                *ClubManager.js
                                                                *ClubRequests.js
                                                                *MemberManagement.js      


   MEMBER 08 :  
                    
                        Name -K P B Katawala
                        GitHub User name -PasiKatawala
                        Brach name -feature/student-management-lead-36996
                        GitHub profile link - https://github.com/PasiKatawala
                        Student id - 36996
                        Role - student-management-lead
                        Files done -   
                                            Back end : 
                                                                *UserService
                                                                *CustomUserDetailsService
                                                           
                                            Front end :
                                                                *AllMembers.js
                                                                *Profile.js
                                                                *AuthContext.js
                                                                *MyClubs.js.
                                                                                                                                                                         
MEMBER 09 :  
                    
                        Name -  SHDW  Nandasiri
                        GitHub User name - Dewmi-16
                        Brach name - feature/settings-system-37352
                        GitHub profile link -https://github.com/Dewmi-16
                        Student id - 37352
                        Role -settings-system
                        Files done -   
                                            Back end : 
                                                                *DataInitializer
                                                                *UserProfileDto
                                                                *JwtService
                                                                *AuthResponse

                                            Front end :
                                                                *About.js
                                                                *Contact.js
                                                                *Support.js
                                                                *Features.js.

MEMBER 10 :  
                    
                        Name - L.R Rathnayake 
                        GitHub User name - Lasini-Ravishani-Rathnayake
                        Brach name -feature/packaging-and-support-37181
                        GitHub profile link - https://github.com/Lasini-Ravishani-Rathnayake
                        Student id - 37181
                        Role - packaging-and-support
                        Files done -   
                                            Back end : 
                                                                *package-info.java
                                                                * API Documentation logic. 
                                                        

                                            Front end :
                                                                *About.js
                                                                *Contact.js
                                                                *Support.js
                                                                *Features.js.                                                              



## Contribution Percentage for the project by members  : 


Member 01 - Thaveesha-Nirman :  10%  

Member 02  - yohaniranawaka63-glitch :  10%

Member 03  -  NilakshaChathuranga :  10%

Member 04  - kwtnpothuwila :  10%

Member 05  - P K D Nethmika  :  10%

Member 06 - W.M.D.T.Warshakoon :  10%

Member 07 - rphbprabodhani :  10%

Member 08 - PasiKatawala :  10%

Member 09 - Dewmi-16 :  10%

Member 10 - Lasini-Ravishani-Rathnayake :  10%


## Screenshots


   <img width="1881" height="982" alt="image" src="https://github.com/user-attachments/assets/3b7663b3-30a5-40d1-8964-f585b95177d0" />
   <img width="1872" height="1036" alt="image" src="https://github.com/user-attachments/assets/ea9dcfec-9e5f-4102-9039-5080942f68fd" />
   <img width="1909" height="1055" alt="image" src="https://github.com/user-attachments/assets/ff073dac-1a2c-4a49-a1da-56d00f0c00fc" />
   <img width="1895" height="1049" alt="image" src="https://github.com/user-attachments/assets/39df81d3-22d9-47c8-987a-2bc256cba253" />
   <img width="1869" height="1023" alt="image" src="https://github.com/user-attachments/assets/e753dbc1-d816-4b47-81af-e1f786ce9df7" />
   <img width="1875" height="1030" alt="image" src="https://github.com/user-attachments/assets/ef77e708-d5b9-484b-a3d4-3eba03265b04" />
   <img width="1145" height="855" alt="image" src="https://github.com/user-attachments/assets/ca7b3422-fb4f-4fc0-a7e6-315026149e2c" />
   <img width="1568" height="1034" alt="image" src="https://github.com/user-attachments/assets/a72340f5-da47-4d43-8fbc-89bb8cf6493e" />


   






   

   







