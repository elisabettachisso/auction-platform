const { createApp } = Vue;

const app = createApp({
  data() {
    return { username: "", password: "", fail: false, success: false };
  },
  methods: {
    async login () {
        this.fail = false;
        this.success = false;
        try{
            const response = await fetch("/api/auth/signin", {
                method: "post",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  username: this.username,
                  password: this.password,
                }),
              });
              const json = await response.json();
              if(response.status === 200){
                this.success = true;
                await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.href = "/";
              } else {
                this.fail = true;
                console.log("Login fallito");
              }
        } catch(err){
            console.log(err);
        }
      
    },
  },
});
app.mount("main");
