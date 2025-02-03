import MaterialDesignIcon from "@mdi/react";

type IconProperties = React.ComponentProps<typeof MaterialDesignIcon>;

export function Icon(properties: IconProperties) {
  return (
    <MaterialDesignIcon size="1.25em" aria-hidden="true" {...properties} />
  );
}
