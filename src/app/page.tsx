"use client";

import { useEffect } from "react";
import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Spinner from "@/components/Spinner";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/to-do-list");
    }
  }, [isSignedIn]);

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faPlus} />,
      label: "Create tasks",
    },
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      label: "Edit your tasks",
    },
    {
      icon: <FontAwesomeIcon icon={faTrash} />,
      label: "Delete your tasks",
    },
  ];

  const taskStatus = [
    {
      color: "yellow-600",
      label: "Pending",
    },
    {
      color: "sky-600",
      label: "In progess",
    },
    {
      color: "green-700",
      label: "Done",
    },
  ];

  return (
    <>
      {isLoaded && isSignedIn ? (
        <Spinner/>
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-4 py-4 min-h-[80vh]">
          <h1 className="font-semibold text-3xl text-purple-800 text-center py-4">
            Welcome to your Next To Do List app!
          </h1>
          <p className="font-semibold text-xl text-center">
            <SignedOut>
              <SignInButton>
                <span className="hover:cursor-pointer text-purple-800 hover:text-purple-600 font-semibold duration-300">
                  Sing in{" "}
                </span>
              </SignInButton>
            </SignedOut>
            to your account to start adding your tasks.
          </p>
          <div className="flex flex-col gap-y-12 mt-8 text-lg font-semibold">
            <div className="bg-purple-800 px-4 py-8 rounded-2xl">
              <p className="text-center text-neutral-50">
                With this app you can easily:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                {actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex justify-between md:gap-x-4 bg-neutral-100 text-purple-800 rounded-2xl p-4 hover:-translate-y-1 duration-300 hover:cursor-default"
                  >
                    <p className="text-center">{action.label}</p>
                    <span>{action.icon}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-neutral-950 border-2 border-neutral-900 px-4 py-8 rounded-2xl">
              <p className="text-center">
                Also you can manage the{" "}
                <span className="text-purple-800 font-semibold">status</span> of
                your task by setting them:{" "}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                {taskStatus.map((status, index) => (
                  <div
                    key={index}
                    className={`bg-${status.color} rounded-2xl p-4 hover:-translate-y-1 duration-300 hover:cursor-default`}
                  >
                    <p className="font-semibold text-neutral-50 text-center">
                      {status.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
