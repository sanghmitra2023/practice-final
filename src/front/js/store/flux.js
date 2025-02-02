const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			authToken: null,
			user: null,
			users: [],
			dog: [],
			favorites: [],
			appointments: [],
		},
		actions: {


			login: async (email, password, navigate) => {
				try {
					console.log("before fetch")
					const response = await fetch(
						"https://organic-space-invention-wwrjggpr69vcv454-3001.app.github.dev/api/token",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								"email": email,
								"password": password
							}),
						}
					);
					console.log("after response")
					if (response.ok) {
						const data = await response.json()
						setStore({ authToken: data.token });
						navigate("/private")
						return true
					}
				} catch (error) {
					console.log(error);
				};
				return false

			},

			getUser: async () => {
				const store = getStore()
				try {
					const response = await fetch("https://organic-space-invention-wwrjggpr69vcv454-3001.app.github.dev/api/protected", {
						headers: { Authorization: `Bearer ${store.authToken}` }
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ user: data })
						localStorage.setItem("user", JSON.stringify(data))
					}
				}
				catch (error) {
					console.log(error)
				}

			},

			loadUser: async () => {
				const store = getStore();
				try {
					const response = await fetch("https://organic-space-invention-wwrjggpr69vcv454-3001.app.github.dev/api/user", {
						headers: { Authorization: `Bearer ${store.authToken}` }
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ users: data.users })
					}
				}
				catch (error) {
					console.log(error)
				}

			},

			logOut: async (navigate) => {
				setStore({ user: null })
				localStorage.clear()
				navigate("/")
			},


			addFavorites: (name) => {
				const store = getStore();
				setStore({ favorites: [...store.favorites, name] });
			  },

			addDogToFavourite: async (dog_id, user_id) => {
				try {
					const response = await fetch(
						"https://organic-space-invention-wwrjggpr69vcv454-3001.app.github.dev/api/favorite/dog/"+dog_id,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								"id": user_id,
								
							}),
						}
					);

					if (response.ok) {
						const data = await response.json()
						return true
					}
				} catch (error) {
					console.log(error);
				};
				return false

			},

			getFavouriteDogs: async (id) => {
				const store = getStore()
				try {
					const response = await fetch(process.env.BACKEND_URL+'/api/user/favorite/'+id)
					if (response.ok) {
						const data = await response.json();
						const dogs = data.map(item=>item.dog.name)
						setStore({ favorites: [...store.favorites, ...dogs ]})
					}
				}
				catch (error) {
					console.log(error)
				}

			},

		
			deleteItem: (i) => {
				const store = getStore();
				let newFavorites = store.favorites.filter((item, index) => {
				  return i != index;
				});
				setStore({ favorites: newFavorites });
			  },

			deleteFavoriteDog: async (id, name) => {
				const store = getStore()
				try {
					const response = await fetch(process.env.BACKEND_URL+'/api/favorite/user/'+id +'/dog/'+name,{
						method:"DELETE"
					})
					if (response.ok) {
						const data = await response.json();
						console.log(data)
					}
				}
				catch (error) {
					console.log(error)
				}

			},

		
			loadSomeData: () => {
				fetch("https://organic-space-invention-wwrjggpr69vcv454-3001.app.github.dev/api/dog")
				  .then((res) => res.json())
				  .then((data) => {
					console.log(data);
					setStore({ dog: data });
				  })
				  .catch((err) => console.error(err));
			  },
			  // Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			setDogData: (data) => {
				const store = getStore();
				setStore({ ...store, dogs: data });
			},
			setAppointmentData: (data) => {
				const store = getStore();
				setStore({ ...store, appointments: data });
			},
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;