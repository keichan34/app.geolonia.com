import React from "react";
import fetch from "../../../lib/fetch";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconDownload from "@material-ui/icons/CloudDownload";
import moment from "moment";
import { __ } from "@wordpress/i18n";

type OwnProps = {};
type StateProps = {
  session: Geolonia.Session;
  teamId?: string;
  language: string;
};
type Props = OwnProps & StateProps;

const useInvoices = (props: Props) => {
  const { session, teamId } = props;
  const [loaded, setLoaded] = React.useState(false);
  const [invoices, setInvoices] = React.useState<Geolonia.Invoice[]>([]);
  const [charges, setCharges] = React.useState<Geolonia.Charge[]>([]);

  // チーム変えたらロード状態をリセット
  React.useEffect(() => {
    setLoaded(false);
    setInvoices([]);
    setCharges([]);
  }, [teamId]);

  React.useEffect(() => {
    if (loaded) {
      return;
    } else {
      const headers = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      };
      const urlBase = `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/teams/${teamId}`;
      const handleResponse = (res: Response) => {
        if (res.status < 400) {
          return res.json();
        } else {
          console.error(res);
          // throw new Error();
        }
      };

      Promise.all([
        fetch(session, `${urlBase}/invoices`, headers).then(handleResponse),
        fetch(session, `${urlBase}/charges`, headers).then(handleResponse)
      ])
        .then(([invoices, charges]) => {
          if (invoices && charges) {
            setInvoices(invoices.data);
            setCharges(charges.data);
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoaded(true);
        });
    }
  }, [session, teamId, loaded, invoices, charges]);

  return { invoices, charges, loaded };
};

function PaymentHistory(props: Props) {
  const { invoices, charges, loaded } = useInvoices(props);
  const formatter = (currency: string) =>
    new Intl.NumberFormat(props.language, { style: "currency", currency });
  if (!loaded && invoices.length === 0) {
    return null;
  }
  if (loaded && invoices.length === 0) {
    return <p>{__("No payment history.")}</p>;
  }
  // const currentBalance =
  //   invoices[0] && invoices[0].ending_balance !== null
  //     ? formatter(invoices[0].currency).format(
  //         -invoices[0].ending_balance / 100
  //       )
  //     : "-";
  return (
    <Table className="payment-info">
      <TableBody>
        {invoices
          .map(invoice => {
            const {
              total,
              currency,
              period_start,
              ending_balance,
              starting_balance,
              id,
              descriptions
            } = invoice;

            // const formattedTotal = new Intl.NumberFormat(props.language, {
            //   style: "currency",
            //   currency
            // }).format(Math.abs(total) / 100);
            const value =
              (total - (ending_balance || 0) + starting_balance) / 100;
            const formattedActualPayment = formatter(currency).format(value);
            // const formattedBalanced = formatter(currency).format(
            //   ((ending_balance || 0) - starting_balance) / 100
            // );

            const charge = charges.find(charge => charge.invoice === id);

            return {
              date: moment(period_start * 1000).format("YYYY-MM-DD"),
              total,
              payment: formattedActualPayment,
              id,
              descriptions,
              receipt_url: charge && charge.receipt_url,
              value
            };
          })
          .filter(data => data.total > 0 && data.value > 0)
          .map(data => {
            const { id, date, payment, receipt_url, descriptions } = data;
            return (
              <TableRow key={id}>
                <TableCell>{date}</TableCell>
                <TableCell>
                  <ul>
                    {descriptions
                      .filter(x => !!x)
                      .map((description, index) => (
                        <li key={index}>{description}</li>
                      ))}
                  </ul>
                </TableCell>
                <TableCell>{payment}</TableCell>
                <TableCell>
                  {receipt_url && (
                    <a href={receipt_url}>
                      <IconDownload></IconDownload>
                    </a>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const language = state.userMeta.language;
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId,
      language
    };
  } else {
    return { session, language };
  }
};

export default connect(mapStateToProps)(PaymentHistory);
