import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Text, Modal, Button, Group } from '@mantine/core';
import { notify } from '../Notify/Notify';

export default function Footer() {
	const [opened, { open, close }] = useDisclosure(false);
	const [cookies, , removeCookie] = useCookies(['token']);

	return (
		<footer className="mt-10 mb-5 text-xs lg:text-sm flex flex-col-reverse md:flex-row gap-4 justify-between text-[#5f5e5a]">
			<Modal opened={opened} onClose={close} centered title="Logout">
				<Text fz="sm">You are about to logout as admin. Continue?</Text>
				<Group position="right" className="mt-4" spacing="xs">
					<Button size="xs" variant="default" onClick={close}>
						Cancel
					</Button>
					<Button size="xs" onClick={handleOnLogout} color="red">
						Continue
					</Button>
				</Group>
			</Modal>
			<div>
				<p className="my-0">
					In Partial Fulfillment of the Requirement for the Degree <b>Bachelor of Science in Information Technology</b>{' '}
					in <br /> <b>Mindanao State University-Iligan Institute of Technology</b>, Iligan City, Philippines © January
					2023
				</p>
			</div>
			<div>
				<ul className="my-0 p-0 underline list-none flex gap-6">
					<li>
						<Link to="/" className="text-[#5f5e5a]">
							Home
						</Link>
					</li>
					<li>
						<Link to="/admin" className="text-[#5f5e5a]">
							Admin
						</Link>
					</li>
					{cookies.token && (
						<li className="hover:cursor-pointer" onClick={open}>
							Logout
						</li>
					)}
				</ul>
			</div>
		</footer>
	);

	function handleOnLogout(e) {
		axios
			.post(
				'http://127.0.0.1:8000/api/dj-rest-auth/logout/',
				{},
				{
					headers: {
						Authorization: `Token ${cookies.token}`,
					},
				}
			)
			.then((response) => removeCookie('token'))
			.catch((error) => notify('error', error.message));
		close();
	}
}
