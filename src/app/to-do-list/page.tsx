import ToDoList from '@/components/ToDoList'
import { HydrateClient, api } from '@/trpc/server'
import React from 'react'

function page() {
  void api.task.getAll.prefetch();
  return (
    <HydrateClient>
      <ToDoList/>
    </HydrateClient>
  )
}

export default page