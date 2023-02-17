-- CreateTable
CREATE TABLE "todo_list" (
    "id" STRING NOT NULL,
    "todo" STRING NOT NULL,
    "success" BOOL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todo_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "todo_list_todo_key" ON "todo_list"("todo");
