import { Image } from "@nextui-org/image";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { Upload } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Slider,
  useDisclosure,
} from "@nextui-org/react";
import AvatarEditor from "react-avatar-editor";
import { setToastChanges } from "@/reducers/toastReducer";
import { useDispatch, useSelector } from "react-redux";
import UnsavedToast from "@/components/UnsavedToast";
import { RootState } from "@/types/Reducer";

const General = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [companyWebsite, setCompanyWebsite] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [newLogo, setNewLogo] = useState<File>({} as File);
  const [zoom, setZoom] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const newLogoRef = useRef<AvatarEditor>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [changes, setChanges] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("organizations/settings");
      setCompanyName(res.data.data.name || "");
      setCompanyEmail(res.data.data.email || "");
      setCompanyWebsite(res.data.data.website || "");
      setLogo(res.data.data.logo);
      setChanges(false);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const org = useSelector((state: RootState) => state.organization);
  const triggerSaveToast = () => {
    if (!changes) {
      dispatch(setToastChanges(true));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("organizations/settings/general", {
        name: companyName,
        email: companyEmail,
        website: companyWebsite,
        logo: logo,
      });
      toast.success("Settings updated successfully");
      setChanges(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error updating settings. Please try again.");
    } finally {
      dispatch(setToastChanges(false));
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setChanges(true);
      triggerSaveToast();
    };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewLogo(file);
      onOpen();
    }
  };

  const updateLogo = () => {
    const canvas = newLogoRef.current?.getImage().toDataURL("image/png");
    axios
      .post("organizations/settings/logo", { logo: canvas })
      .then(() => {
        setLogo(canvas || "");
        toast.success("Logo updated successfully");
        onOpenChange();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error updating logo. Please try again.");
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <UnsavedToast action={handleSave} />
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/general"}>General</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="p-5 px-10">
        <div className="w-fit">
          {logo ? (
            <Image src={logo} width={200} height={200} />
          ) : (
            <p className="mt-5 text-center text-sm opacity-50">
              No Logo Found. Upload one to make your organization look better.
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <Button
            className="mt-2 w-[200px]"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload /> Change Logo
          </Button>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  New Logo
                </ModalHeader>
                <ModalBody className="justify-center items-center gap-5">
                  <AvatarEditor
                    ref={newLogoRef}
                    image={newLogo}
                    width={200}
                    height={200}
                    border={50}
                    scale={zoom}
                    rotate={0}
                  />

                  <div className="w-full flex items-center justify-center flex-col gap-2">
                    <p>Zoom</p>
                    <Slider
                      minValue={1}
                      maxValue={2}
                      step={0.01}
                      value={zoom}
                      onChange={(value) => setZoom(value as number)}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="success"
                    onPress={onClose}
                    onClick={updateLogo}
                  >
                    Update
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <div className="flex gap-3 w-[50%] items-center mt-10">
          <p className="w-[40%]">Company Name</p>
          <Input
            value={companyName}
            onChange={handleInputChange(setCompanyName)}
          />
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-3">
          <p className="w-[40%]">Company Email</p>
          <Input
            value={companyEmail}
            onChange={handleInputChange(setCompanyEmail)}
          />
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-3">
          <p className="w-[40%]">Company Website</p>
          <Input
            value={companyWebsite}
            onChange={handleInputChange(setCompanyWebsite)}
          />
        </div>
      </div>
    </>
  );
};

export default General;
