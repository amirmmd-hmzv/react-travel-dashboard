import { loginWithGoogle, logoutUser } from "lib/appwrite/auth";
import { account } from "lib/appwrite/client";
import { FaGoogle } from "react-icons/fa";
import { Link, redirect, useNavigate } from "react-router";

export async function clientLoader() {
    
  try {
    const user = await account.get();
    console.log(user)
    if (user.$id) return redirect("/");
  } catch (e) {
    console.log("Error fetching user", e);
  }
}

const SignIn = () => {


  const handleSignIn = async () => {
    await loginWithGoogle();
  };



  return (
    <main className="auth">
      <section className="size-full flex-center  glassmorphism px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link
              to={`/`}
              className="flex justify-center flex-col items-center gap-2"
            >
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-16"
              />
              <span className="text-primary-100  font-clash-display tracking-wider font-bold text-2xl">
                Teal Horizon
              </span>
            </Link>
          </header>

          <article>
            <h2 className="p-28-semibold  leading-6! md:leading-normal  text-center text-dark-100 tracking-wider">
              start your travel journey
            </h2>

            <p className="p-18-regular text-center text-gray-100 leading-7! mt-2.5">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>

          <button
            onClick={handleSignIn}
            className="p-4  cursor-pointer transition duration-300 shadow-300 w-full font-semibold tracking-wider text-sm md:text-md  lg:text-lg font-clash-display bg-primary-100 hover:bg-primary-500 text-white rounded-lg text-center flex justify-center items-center gap-2 "
          >
            <FaGoogle size={24} />
            <span>Sign in with Google</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
