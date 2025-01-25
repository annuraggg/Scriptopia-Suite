import { Button, Card } from "@nextui-org/react";

const prices = [
  { name: "Quaterly", price: 24.99, monthly: 8.33 },
  {
    name: "Annual",
    price: 59.99,
    monthly: 4.99,
    desc: "Save 40% with an annual subscription",
  },
];

const Plan = ({
  plan = "quaterly",
  renews,
}: {
  plan: string;
  renews: string | null;
}) => {
  return (
    <div className="p-5">
      <div className="flex gap-3 border rounded-xl px-5 py-3">
        <p>You are currently on the {plan} plan.</p>
      </div>

      <div className="flex gap-3 border rounded-xl px-5 py-3 mt-3">
        <div>Renews on: {renews}</div>
      </div>

      <Button className="mt-3">Go to Billing Portal</Button>

      <p className="opacity-50 mt-5 text-center">Change your plan here.</p>

      <div className="flex justify-between mt-5 gap-5 w-full">
        {prices.map((price) => (
          <Card className="border p-5 rounded-lg w-full  bg-opacity-5 relative pb-20">
            <h5>{price.name}</h5>
            <h1 className=" mt-5 font-poly">
              ${price.monthly} <sub>/month</sub>
            </h1>

            <p className=" text-xs mt-5">
              Billed ${price.price} {price.name}
            </p>

            {price.desc && (
              <p className="text-xs text-warning mt-2">{price.desc}</p>
            )}
            <Button
              className="mt-5 float-right absolute right-5 bottom-5"
              variant="flat"
              isDisabled={plan.toLowerCase() === price.name.toLowerCase()}
              color={
                plan.toLowerCase() === price.name.toLowerCase()
                  ? "success"
                  : plan === "quaterly"
                  ? "primary"
                  : "warning"
              }
            >
              {plan.toLowerCase() === price.name.toLowerCase()
                ? "Current Plan"
                : plan === "quaterly"
                ? "Upgrade"
                : "Downgrade"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Plan;
