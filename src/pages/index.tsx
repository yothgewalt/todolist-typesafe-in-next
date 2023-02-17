import  type { NextPage } from 'next';

import React from 'react';

import { useRouter } from 'next/router';

import { ActionIcon, Box, Button, Container, Flex, Group, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

import { IconCircleCheck, IconCircleCheckFilled, IconTrash } from '@tabler/icons-react';

import { api } from '@utils/api';

const IndexPage: NextPage = (props) => {
    const router = useRouter();

    const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);

    const createTodo = api.todo.createTodo.useMutation();
    const todoList = api.todo.todoList.useInfiniteQuery({ limit: 5 });
    const updateStatus = api.todo.updateStatusById.useMutation();
    const deleteTodo = api.todo.dropById.useMutation();

    const todoForm = useForm({
        initialValues: {
            todo: '',
        }
    });

    const TodoOnSubmitHandler = async (values: { todo: string }) => {
        setButtonLoading(true);

        try {
            await createTodo.mutateAsync(values);
            setButtonLoading(false);
            router.reload();

        } catch (cause: any) {
            console.error({ cause }, 'Failed to create todo.');
        }
    }

    const TodoSuccessOnClickHandler = async (id: string, status: boolean) => {
        try {
            await updateStatus.mutateAsync({ id: id, status: status })
            router.reload();

        } catch (cause: any) {
            console.error({ cause }, 'Failed to change status todo.')
        }
    }

    const DeleteTodoOnClickHandler = async (id: string) => {
        try {
            await deleteTodo.mutateAsync({ id: id });
            router.reload();

        } catch (cause: any) {
            console.error({ cause }, 'Failed to delete todo.')
        }
    }

    React.useEffect(() => {

    }, []);

    return (
        <Container sx={{ width: '100%', height: '100vh' }} size={'md'} px={'xs'}>
            <Flex w={'100%'} h={'100%'} gap={'xl'} direction={'row'} justify={'center'} align={'center'} wrap={'wrap'}>
                <Box sx={{ minWidth: 360 }}>
                    <Title order={3}>Let's manage your life with Todoist.</Title>
                    <form onSubmit={todoForm.onSubmit((values) => TodoOnSubmitHandler(values))}>
                        <Group position={'center'} mt={'xl'}>
                            <TextInput
                                w={'100%'}
                                label='What are you going to do today?'
                                description='Type a routine that relates to your daily life.'
                                {...todoForm.getInputProps('todo')}
                            />
                        </Group>
                        <Group position={'center'} mt={'xl'}>
                            {buttonLoading ? (
                                <Button w={'100%'} color={'blue'} type={'submit'} loading>Add your routine</Button>
                            ) : (
                                <Button w={'100%'} color={'blue'} type={'submit'}>Add your routine</Button>
                            )}
                        </Group>
                    </form>
                </Box>
                <Box sx={{ minWidth: 375 }}>
                    {todoList.data?.pages.map((page, index) => (
                        <React.Fragment key={page.items[0]?.id || index}>
                            {page.items.length === 0 ? (
                                <React.Fragment>
                                    <Group position={'center'}>
                                        <span>You haven't added anything yet.</span>
                                    </Group>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {page.items.map((item) => {
                                        return (
                                            <Flex key={item.id} mt={14} w={'100%'} gap={'md'} direction={'row'} justify={'space-between'} align={'center'} wrap={'wrap'}>
                                                <Flex direction={'row'} justify={'center'} align={'center'} gap={5}>
                                                    {item.success ? (
                                                        <React.Fragment>
                                                            <ActionIcon onClick={() => TodoSuccessOnClickHandler(item.id, false)}>
                                                                <IconCircleCheckFilled className={'text-[#2f9e44]'} size={22} />
                                                            </ActionIcon>
                                                            <Text color={'green'}>{item.todo}</Text>
                                                        </React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            <ActionIcon onClick={() => TodoSuccessOnClickHandler(item.id, true)}>
                                                                <IconCircleCheck size={22} />
                                                            </ActionIcon>
                                                            <Text>{item.todo}</Text>
                                                        </React.Fragment>
                                                    )}
                                                </Flex>
                                                <ActionIcon onClick={() => DeleteTodoOnClickHandler(item.id)}>
                                                    <IconTrash size={20} />
                                                </ActionIcon>
                                            </Flex>
                                        );
                                    })}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    ))}
                </Box>
            </Flex>
        </Container>
    );
};

export default IndexPage;
